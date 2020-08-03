//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import { EventEmitter } from 'events';

import { createId } from '@dxos/crypto';
import { Transform, Readable } from 'stream';
import { Constructor } from 'protobufjs';
import { dxos } from './proto/gen/testing';

const log = debug('dxos:echo:database');

/**
 * Abstract base class for Models.
 */
export abstract class Model extends EventEmitter {
  constructor (
    protected _id: string,
    protected _readable: NodeJS.ReadableStream,
    protected _writable?: NodeJS.WritableStream
  ) {
    super();
  }

  /**
   * Start processing the stream.
   */
  // TODO(burdon): Stop on destroy?
  start () {
    this._readable.pipe(new Transform({
      objectMode: true,
      transform: async (message, _, callback) => {
        const { data } = message;
        await this.processMessage(data);
        this.emit('update');
        callback();
      }
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
  private _models = new Map<string, Constructor<Model>>();

  registerModel (type: string, clazz: Constructor<Model>) {
    assert(type);
    assert(clazz);
    this._models.set(type, clazz);
    return this;
  }

  // TODO(burdon): ID and version.
  createModel (type: string, readable: NodeJS.ReadableStream, writable?: NodeJS.WritableStream) {
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
  constructor (private _model: Model) {
  }

  get model () {
    return this._model;
  }
}

/**
 *
 */
export class ItemManager {
  private _items = new Map<string, Item>();

  constructor (
    private _modelFactory: ModelFactory,
    private _writable: NodeJS.WritableStream
  ) {
    assert(this._modelFactory);
    assert(this._writable);
  }

  /**
   * Creates a data item and writes the genesis block to the stream.
   * @param type
   * @param readable
   */
  async createItem (type: string, readable: NodeJS.ReadableStream) {
    const model = this._modelFactory.createModel(type, readable, this._writable);
    assert(model);
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
  const streams = new LazyMap<string, Readable>(() => new Readable({ objectMode: true }));

  return new Transform({
    objectMode: true,
    transform: async (message, _, callback) => {
      // TODO(burdon): Parse message and route to associated item.
      const { __type_url, itemId } = message;
      switch (__type_url) {
        case 'dxos.echo.testing.TestItemGenesis': {
          assertType<dxos.echo.testing.ITestItemGenesis>(message);
          assert(itemId);
          assert(message.model);

          const stream = streams.getOrInit(itemId);
          itemManager.createItem(itemId, stream);
          break;
        }

        case 'dxos.echo.testing.TestItemMutation': {
          assertType<dxos.echo.testing.ITestItemMutation>(message);
          assert(message.payload);

          const stream = streams.getOrInit(itemId);
          stream.push(message.payload);
        }
      }

      callback();
    }
  });
};

/**
 * A simple syntax sugar to write `value as T` as a statement
 * @param value
 */
function assertType <T> (value: unknown): asserts value is T {}

// TODO(marik_d): Extract somewhere
class LazyMap<K, V> extends Map<K, V> {
  constructor (private _initFn: (key: K) => V) {
    super();
  }

  getOrInit (key: K): V {
    if (this.has(key)) {
      return this.get(key)!;
    } else {
      const value = this._initFn(key);
      this.set(key, value);
      return value;
    }
  }
}
