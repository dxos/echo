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

import { Item } from './item';
import { ModelFactory } from '../models';
import { ItemID } from '../types';

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

  private _createWriteStream (itemId: ItemID): NodeJS.WritableStream {
    const transform = new Transform({
      objectMode: true,
      write (message, _, callback) {
        this.push({
          payload: {
            __type_url: 'dxos.echo.testing.ItemEnvelope',
            itemId,
            payload: message
          }
        });

        callback();
      }
    });

    // TODO(burdon): Don't bury pipe inside methods that create streams (side effects).
    transform.pipe(this._writable);
    return transform;
  }

  /**
   * Creates an item and writes the genesis message.
   * @param itemType item type
   * @param modelType model type
   */
  async createItem (itemType: string, modelType: string): Promise<Item> {
    assert(itemType);
    assert(modelType);

    // Pending until constructed (after genesis block is read from stream).
    const [waitForCreation, callback] = trigger();

    const itemId = createId();
    this._pendingItems.set(itemId, callback);

    // Write Item Genesis block.
    // TODO(burdon): Write directly to the writable stream (not wrapper)?
    log('Writing Genesis:', itemId);
    const writable = this._createWriteStream(itemId);
    await pify(writable.write.bind(writable))({
      __type_url: 'dxos.echo.testing.ItemGenesis',
      type: itemType,
      model: modelType
    });

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
  async constructItem (itemId: ItemID, itemType: string, modelType: string, readable: NodeJS.ReadableStream) {
    assert(itemId);
    assert(itemType);
    assert(modelType);
    assert(readable);

    // Create model.
    // TODO(burdon): Skip genesis message (and subsequent messages) if unknown model.
    const writable = this._createWriteStream(itemId);
    const model = this._modelFactory.createModel(modelType, itemId, readable, writable);
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
