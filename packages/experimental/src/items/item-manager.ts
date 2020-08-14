//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import pify from 'pify';
import { EventEmitter } from 'events';
import { Transform } from 'stream';

import { Event, trigger } from '@dxos/async';
import { createId } from '@dxos/crypto';

import { dxos } from '../proto/gen/testing';

import { ModelType, ModelFactory, Model } from '../models';
import { Item } from './item';
import { ItemID, ItemType } from './types';
import { ResultSet } from '../result';

const log = debug('dxos:echo:item:manager');

export interface ItemFilter {
  type: ItemType
}

/**
 * Manages creation and index of items.
 */
export class ItemManager extends EventEmitter {
  private readonly _update = new Event();

  // Map of active items.
  private _items = new Map<ItemID, Item>();

  // TODO(burdon): Lint issue: Unexpected whitespace between function name and paren
  // Map of item promises (waiting for item construction after genesis message has been written).
  // eslint-disable-next-line
  private _pendingItems = new Map<ItemID, (item: Item) => void>();

  constructor (
    private _modelFactory: ModelFactory,
    private _writable: NodeJS.WritableStream
  ) {
    super();
    assert(this._modelFactory);
    assert(this._writable);
  }

  /**
   * Creates an item and writes the genesis message.
   * @param itemType item type
   * @param modelType model type
   */
  async createItem (itemType: ItemType, modelType: ModelType): Promise<Item> {
    assert(itemType);
    assert(modelType);

    // Pending until constructed (after genesis block is read from stream).
    const [waitForCreation, callback] = trigger();

    const itemId = createId();
    this._pendingItems.set(itemId, callback);

    // Write Item Genesis block.
    log('Writing Genesis:', itemId);
    const message: dxos.echo.testing.IEchoEnvelope = {
      itemId,
      genesis: {
        itemType,
        modelType
      }
    };

    await pify(this._writable.write.bind(this._writable))(message);

    // Unlocked by construct.
    log('Waiting for item...');
    return await waitForCreation();
  }

  /**
   * Constructs an item with the appropriate model.
   * @param itemId
   * @param itemType
   * @param modelType
   * @param readable Inbound mutation stream.
   */
  async constructItem (itemId: ItemID, itemType: ItemType, modelType: ModelType, readable: NodeJS.ReadableStream) {
    assert(itemId);
    assert(itemType);
    assert(modelType);
    assert(readable);

    // TODO(burdon): Skip genesis message (and subsequent messages) if unknown model. Build map of ignored items.
    if (!this._modelFactory.hasModel(modelType)) {
      throw new Error(`Unknown model: ${modelType}`);
    }

    // TODO(burdon): Use createTransform.
    // Create transform to augment outbound model mutations.
    const transform = new Transform({
      objectMode: true,
      transform (message, _, callback) {
        callback(null, {
          itemId,
          operation: message
        });
      }
    });

    // Connect streams.
    transform.pipe(this._writable);

    // Create model.
    const model: Model<any> = this._modelFactory.createModel(modelType, itemId, transform);
    assert(model, `Invalid model: ${modelType}`);

    // TODO(burdon): User or system model? Handle by item?
    readable.pipe(model.processor);

    // Create item.
    const item = new Item(itemId, itemType, model);
    assert(!this._items.has(itemId));
    this._items.set(itemId, item);
    log('Constructed:', String(item));

    // Item udpated.
    // TODO(burdon): Get event.
    // model.on('update', () => {
    //   item.emit('update', item);
    //   this.emit('update', item);
    // });

    // Notify pending creates.
    this._pendingItems.get(itemId)?.(item);
    this.emit('create', item);
    return item;
  }

  /**
   * Retrieves a item from the index.
   * @param itemId
   */
  getItem (itemId: ItemID): Item | undefined {
    return this._items.get(itemId);
  }

  /**
   * Return matching items.
   * @param [filter]
   */
  async queryItems (filter?: ItemFilter): Promise<ResultSet<Item>> {
    const { type } = filter || {};
    return new ResultSet<Item>(this._update, () => Array.from(this._items.values())
      .filter(item => !type || type === item.type));
  }
}
