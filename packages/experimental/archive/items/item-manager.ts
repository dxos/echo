//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import pify from 'pify';
import { EventEmitter } from 'events';
import { Transform } from 'stream';

import { trigger } from '@dxos/async';
import { createId } from '@dxos/crypto';

import { ModelFactory } from '@dxos/experimental/dist/models';
import { ItemID, ItemType, ModelType } from '@dxos/experimental/dist/types';
import { Item } from './item';
import { dxos } from '@dxos/experimental/src/proto/gen/testing';
import IEchoEnvelope = dxos.echo.testing.IEchoEnvelope;

const log = debug('dxos:echo:item');

/**
 * Manages creation and index of items.
 */
export class ItemManager extends EventEmitter {
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
    const message: IEchoEnvelope = {
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
   * @param readable
   */
  async constructItem (itemId: ItemID, itemType: ItemType, modelType: ModelType, readable: NodeJS.ReadableStream) {
    assert(itemId);
    assert(itemType);
    assert(modelType);
    assert(readable);

    // TODO(burdon): Skip genesis message (and subsequent messages) if unknown model. Build map of ignored items.
    if (this._modelFactory.hasModel(modelType)) {
      throw new Error(`Unknown model: ${modelType}`);
    }

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
    const model = this._modelFactory.createModel(modelType, itemId, readable, transform);
    assert(model, `Invalid model: ${modelType}`);

    // Create item.
    const item = new Item(itemId, itemType, model);
    assert(!this._items.has(itemId));
    this._items.set(itemId, item);
    log('Constructed Item:', JSON.stringify(item));

    // Item udpated.
    model.on('update', () => {
      item.emit('update', item);
      this.emit('update', item);
    });

    // Notify pending creates.
    this._pendingItems.get(itemId)?.(item);
    this.emit('create', item);
    return item;
  }

  /**
   * Retrieves a data item from the index.
   * @param itemId
   */
  getItem (itemId: ItemID) {
    return this._items.get(itemId);
  }

  /**
   * Return matching items.
   * @param [filter]
   */
  getItems (filter: any = {}) {
    const { type } = filter;
    return Array.from(this._items.values()).filter(item => !type || item.type === type);
  }
}
