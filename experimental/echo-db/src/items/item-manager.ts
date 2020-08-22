//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import pify from 'pify';

import { Event, trigger } from '@dxos/async';
import { createId } from '@dxos/crypto';
import { dxos, ItemID, ItemType, IEchoStream } from '@dxos/experimental-echo-protocol';
import { Model, ModelType, ModelFactory, ModelMessage } from '@dxos/experimental-model-factory';
import { createTransform, jsonReplacer } from '@dxos/experimental-util';

import { ResultSet } from '../result';
import { Item } from './item';

const log = debug('dxos:echo:item-manager');

export interface ItemFilter {
  type: ItemType
}

/**
 * Manages the creation and indexing of items.
 */
export class ItemManager {
  private readonly _itemUpdate = new Event<Item<any>>();

  // Map of active items.
  private _items = new Map<ItemID, Item<any>>();

  // TODO(burdon): Lint issue: Unexpected whitespace between function name and paren
  // Map of item promises (waiting for item construction after genesis message has been written).
  // eslint-disable-next-line
  private _pendingItems = new Map<ItemID, (item: Item<any>) => void>();

  _modelFactory: ModelFactory;
  _writeStream?: NodeJS.WritableStream;

  /**
   * @param modelFactory
   * @param writeStream Outbound `dxos.echo.IEchoEnvelope` mutation stream.
   */
  constructor (modelFactory: ModelFactory, writeStream?: NodeJS.WritableStream) {
    assert(modelFactory);
    this._modelFactory = modelFactory;
    this._writeStream = writeStream;
  }

  /**
   * Creates an item and writes the genesis message.
   * @param itemType item type
   * @param modelType model type
   */
  async createItem (itemType: ItemType, modelType: ModelType): Promise<Item<any>> {
    assert(this._writeStream);
    assert(itemType);
    assert(modelType);

    // Pending until constructed (after genesis block is read from stream).
    const [waitForCreation, callback] = trigger();

    const itemId = createId();
    this._pendingItems.set(itemId, callback);

    // Write Item Genesis block.
    log('Writing Genesis:', itemId);
    const message: dxos.echo.IEchoEnvelope = {
      itemId,
      genesis: {
        itemType,
        modelType
      }
    };

    // TODO(burdon): Push?
    await pify(this._writeStream.write.bind(this._writeStream))(message);

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
    assert(this._writeStream);
    assert(itemId);
    assert(itemType);
    assert(modelType);
    assert(readable);

    // TODO(burdon): Skip genesis message (and subsequent messages) if unknown model. Build map of ignored items.
    if (!this._modelFactory.hasModel(modelType)) {
      throw new Error(`Unknown model: ${modelType}`);
    }

    //
    // Convert inbound mutation (to model).
    //
    const inboundTransform = createTransform<IEchoStream, ModelMessage<any>>(async (message: IEchoStream) => {
      console.log('>>>>>', JSON.stringify(message, jsonReplacer, 2));

      const { meta, data: { itemId: mutationItemId, objectMutation } } = message;
      assert(mutationItemId === itemId);
      const response: ModelMessage<any> = {
        meta,
        mutation: objectMutation
      };

      return response;
    });

    //
    // Convert outbound mutation (from model).
    //
    const outboundTransform = createTransform<any, dxos.echo.IEchoEnvelope>(async (message) => {
      const response: dxos.echo.IEchoEnvelope = {
        itemId,
        objectMutation: message
      };

      console.log('<<<<<', JSON.stringify(message, undefined, 2));

      return response;
    });

    // Create model.
    const model: Model<any> = this._modelFactory.createModel(modelType, itemId, outboundTransform);
    assert(model, `Invalid model: ${modelType}`);

    // Connect streams.
    outboundTransform.pipe(this._writeStream);
    readable.pipe(inboundTransform).pipe(model.processor);

    // Create item.
    const item = new Item(itemId, itemType, model);
    assert(!this._items.has(itemId));
    this._items.set(itemId, item);
    log('Constructed:', String(item));

    // Item udpated.
    // TODO(burdon): Update the item directly?
    this._itemUpdate.emit(item);

    // Notify pending creates.
    this._pendingItems.get(itemId)?.(item);
    return item;
  }

  /**
   * Retrieves a item from the index.
   * @param itemId
   */
  getItem (itemId: ItemID): Item<any> | undefined {
    return this._items.get(itemId);
  }

  /**
   * Return matching items.
   * @param [filter]
   */
  async queryItems (filter?: ItemFilter): Promise<ResultSet<Item<any>>> {
    const { type } = filter || {};
    return new ResultSet<Item<any>>(this._itemUpdate, () => Array.from(this._items.values())
      .filter(item => !type || type === item.type));
  }
}
