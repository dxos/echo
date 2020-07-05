//
// Copyright 2020 DxOS.org
//

import assert from 'assert';
import debug from 'debug';
import { EventEmitter } from 'events';

import { EchoMessage } from './echo-feeds';
import { Order, LogicalClockStamp } from './consistency';
import { dxos } from './proto/gen/echo';
import { MutationUtil, ValueUtil } from './mutation';
import { parseObjectId } from './util';

interface LastWriterObjectBase {
  id: string,
  properties?: object,
}

const log = debug('dxos:echo:objectstore');

/**
 * Create a set mutation messages from a single object.
 */
// TODO(burdon): Rename.
export const fromObject = ({ id, properties = {} }: LastWriterObjectBase): dxos.echo.IObjectMutation => {
  assert(id);

  return {
    objectId: id,
    mutations: Object.entries(properties).map(([key, value]) => ({
      key,
      value: ValueUtil.createMessage(value)
    }))
  };
};

/**
 * Create a set mutation messages from a collection of objects.
 */
export const fromObjects = (objects: LastWriterObjectBase[]): dxos.echo.IObjectMutation[] => {
  return objects.map(fromObject);
};

/**
 * Simple Object Datastore.
 */
// TODO(burdon): Separate mutable and immutable interface.
// TODO(burdon): Document consistency constraints (e.g., each Object is independent; mutation references previous).
export class LastWriterObjectStore extends EventEmitter {
  // Objects indexed by ID.
  // TODO(burdon): Create secondary index by type.
  _objectById = new Map();

  /**
   * Returns an array of object types.
   * @returns {string[]}
   */
  getTypes () {
    return Array.from(
      Array.from(this._objectById.values()).reduce((set, { id }) => set.add(parseObjectId(id).type), new Set())
    );
  }

  /**
   * Returns an array of objects by type in an unspecified order.
   * @returns {Object[]}
   */
  // TODO(burdon): orderBy?
  getObjectsByType (type: string) {
    return Array.from(this._objectById.values()).filter(({ id }) => parseObjectId(id).type === type);
  }

  /**
   * Returns the object with the given ID (or undefined).
   * @param id
   * @returns {{ id }}
   */
  getObjectById (id: string) {
    return this._objectById.get(id);
  }

  /**
   * Resets the entire model.
   * @returns {ObjectStore}
   */
  reset () {
    this._objectById.clear();
    return this;
  }

  /**
   * Applies an array of mutations, updating the state.
   * @param mutation
   * @returns {ObjectStore}
   */
  // TODO(dboreham): Check that we're careful to create and treat the mutation group as atomic so
  // it can have one clock stamp (or re-write if not).
  applyMutation (message: EchoMessage) {
    const { objectId, deleted, mutations } = message.data as dxos.echo.IObjectMutation;
    assert(objectId);
    assert(message.lcs);
    const mutationsStamp = LogicalClockStamp.fromObject(message.lcs);

    // Remove object.
    // TODO(burdon): Mark as deleted instead of removing from map?
    // TODO(dboreham): Yes, needs a 2P-set
    if (deleted) {
      this._objectById.delete(objectId);
      return this;
    }

    // Create object if not found.
    let object = this._objectById.get(objectId);
    if (!object) {
      object = {
        id: objectId,
        lcs: mutationsStamp,
        properties: {}
      };

      this._objectById.set(objectId, object);
    }

    // Compare the logical clock stamps:
    const objectStamp = LogicalClockStamp.fromObject(object.lcs);
    const order = LogicalClockStamp.compare(objectStamp, mutationsStamp);

    // TODO(dboreham): We could just use totalCompare() here but in future we'll handle conflict resolution in a more sophisticated way
    //  for which we will need to identify concurrent mutations.
    const processMutations = order === Order.AFTER || (order === Order.CONCURRENT && LogicalClockStamp.totalCompare(objectStamp, mutationsStamp));

    if (processMutations) {
      log('Mutations are causally after object current state, applying.');
      MutationUtil.applyMutations(object.properties, mutations || []);
      object.lcs = mutationsStamp;
    } else {
      log('Mutations are causally before object current state, skipping application.');
    }

    return this;
  }

  applyMutations (messages: EchoMessage[]) {
    // TODO(dboreham): Fold this into one function above.
    log(`applyMutations: ${JSON.stringify(messages)}`);
    messages.forEach(message => this.applyMutation(message));

    return this;
  }
}
