//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import EventEmitter from 'events';
import through2 from 'through2';

import { createId } from '@dxos/crypto';

const log = debug('dxos:echo:database');

/**
 * Abstract base class for Models.
 * @abstract
 */
// @ts-ignore // TODO(burdon): Fix.
export class Model extends EventEmitter {
  _id: string;
  _readable: ReadableStream;
  _writable?: WritableStream;

  constructor (id: string, readable: ReadableStream, writable?: WritableStream) {
    super();
    this._id = id;
    this._readable = readable;
    this._writable = writable;
  }

  /**
   * Start processing the stream.
   */
  // TODO(burdon): Stop on destroy?
  start () {
    // @ts-ignore // TODO(burdon): Fix.
    this._readable.pipe(through2.obj(async (message, _, callback) => {
      const { data } = message;
      await this.processMessage(data);
      // @ts-ignore // TODO(burdon): Fix.
      this.emit('update');
      callback();
    }));

    return this;
  }

  /**
   * Process the message.
   * @abstract
   * @param {Object} message
   */
  async processMessage (message: any) {
    assert(message);
  }
}

/**
 * Creates Model instances from a registered collection of Model types.
 */
export class ModelFactory {
  _models = new Map();

  registerModel (type: string, clazz: Function) {
    assert(type);
    assert(clazz);
    this._models.set(type, clazz);
    return this;
  }

  // TODO(burdon): ID and version.
  createModel (type: string, readable: ReadableStream, writable?: WritableStream) {
    const clazz = this._models.get(type);
    if (clazz) {
      // eslint-disable-next-line new-cap
      const model = new clazz(type, readable, writable);
      model.start();
      return model;
    }
  }
}

/**
 * Data item.
 */
// TODO(burdon): Track parent?
export class Item {
  _model: Model;

  constructor (model: Model) {
    this._model = model;
  }

  get model () {
    return this._model;
  }
}

/**
 *
 */
export class ItemManager {
  _modelFactory: ModelFactory;

  _writable: WritableStream;

  _items = new Map();

  constructor (modelFactory: ModelFactory, writable: WritableStream) {
    assert(modelFactory);
    assert(writable);
    this._modelFactory = modelFactory;
    this._writable = writable;
  }

  /**
   * Creates a data item and writes the genesis block to the stream.
   * @param type
   * @param readable
   */
  async createItem (type: string, readable: ReadableStream) {
    const model = this._modelFactory.createModel(type, readable, this._writable);
    const itemId = createId();
    const item = new Item(model);
    this._items.set(itemId, item);

    // TODO(burdon): Write genesis block to stream.

    return item;
  }

  /**
   * Retrieves a data item from the index.
   * @param itemId
   */
  getItem (itemId: string) {
    return this._items.get(itemId);
  }

  /**
   * Return all items.
   */
  // TODO(burdon): Query?
  getItems () {
    return Array.from(this._items.values());
  }
}

/**
 *
 */
export const createItemDemuxer = (itemManager: ItemManager) => {
  return through2.obj(async (message, _, callback) => {
    // TODO(burdon): Parse message and route to associated item.
    const { __type_url, itemId } = message;
    switch (__type_url) {
      case 'dxos.echo.testing.TestItemGenesis': {
        // TODO(burdon): Create item (don't write genesis!)
        // TODO(burdon): Create ReadableStream.
        break;
      }

      case 'dxos.echo.testing.TestItemMutation': {
        // TODO(burdon): Enqueue if item doesn't exist (i.e., read mutations before genesis).
        const item = itemManager.getItem(itemId);
        if (!item) {
          log('Queuing');
        }
      }
    }

    callback();
  });
};
