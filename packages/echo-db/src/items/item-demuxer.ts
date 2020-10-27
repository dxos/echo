//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import { Readable } from 'stream';

import { DatabaseSnapshot, EchoEnvelope, IEchoStream, ItemID, ItemSnapshot, ModelMutation } from '@dxos/echo-protocol';
import { ModelMessage } from '@dxos/model-factory';
import { createReadable, createWritable, jsonReplacer } from '@dxos/util';

import { ItemManager } from './item-manager';

const log = debug('dxos:echo:item-demuxer');

export interface ItemManagerOptions {
  snapshots?: boolean
}

/**
 * Creates a stream that consumes `IEchoStream` messages and routes them to the associated items.
 * @param itemManager
 */
export class ItemDemuxer {
  /**
   * Records model mutations for snapshots.
   * This array is only there if model doesn't have its own snapshot implementation.
   */
  private readonly _modelMutations = new Map<ItemID, ModelMutation[]>();

  private readonly _itemStreams = new Map<ItemID, Readable>();

  constructor (
    private readonly _itemManager: ItemManager,
    private readonly _options: ItemManagerOptions = {}
  ) {}

  open (): NodeJS.WritableStream {
    // TODO(burdon): Should this implement some "back-pressure" (hints) to the PartyProcessor?
    return createWritable<IEchoStream>(async (message: IEchoStream) => {
      log('Reading:', JSON.stringify(message, jsonReplacer));
      const { data: { itemId, genesis, itemMutation, mutation }, meta } = message;
      assert(itemId);

      //
      // New item.
      //
      if (genesis) {
        const { itemType, modelType } = genesis;
        assert(modelType);

        // Create inbound stream for item.
        const itemStream = createReadable<EchoEnvelope>();
        this._itemStreams.set(itemId, itemStream);

        if (this._options.snapshots) {
          // TODO(marik-d): Check if model supports snapshots natively.
          this._beginRecordingItemModelMutations(itemId);

          // Record initial mutation (if it exists).
          if (mutation) {
            this._recordModelMutation(itemId, { meta: message.meta, mutation });
          }
        }

        // Create item.
        // TODO(marik-d): Investigate whether gensis message shoudl be able to set parentId.
        const item = await this._itemManager.constructItem(
          itemId,
          modelType,
          itemType,
          itemStream,
          undefined,
          mutation ? [{ mutation, meta }] : undefined
        );
        assert(item.id === itemId);
      }

      //
      // Set parent item references.
      //
      if (itemMutation) {
        const item = this._itemManager.getItem(itemId);
        assert(item);

        item._processMutation(itemMutation, itemId => this._itemManager.getItem(itemId));
      }

      //
      // Model mutations.
      //
      if (mutation && !genesis) {
        const itemStream = this._itemStreams.get(itemId);
        assert(itemStream, `Missing item: ${itemId}`);

        assert(message.data.mutation);
        if (this._options.snapshots) {
          this._recordModelMutation(itemId, { meta: message.meta, mutation: message.data.mutation });
        }

        // Forward mutations to the item's stream.
        await itemStream.push(message);
      }
    });
  }

  makeSnapshot (): DatabaseSnapshot {
    assert(this._options.snapshots, 'Snapshots are disabled');
    return {
      items: this._itemManager.queryItems().value.map(item => ({
        itemId: item.id,
        itemType: item.type,
        modelType: item.modelType,
        parentId: item.parent?.id,
        mutations: this._modelMutations.get(item.id)
      }))
    };
  }

  async restoreFromSnapshot (snapshot: DatabaseSnapshot) {
    assert(snapshot.items);
    for (const item of sortItemsTopologically(snapshot.items)) {
      assert(item.itemId);
      assert(item.modelType);
      assert(item.mutations);

      assert(!this._itemStreams.has(item.itemId));
      const itemStream = createReadable<EchoEnvelope>();
      this._itemStreams.set(item.itemId, itemStream);

      if (this._options.snapshots) {
        // TODO(marik-d): Check if model supports snapshots natively.
        this._modelMutations.set(item.itemId, item.mutations);
      }

      await this._itemManager.constructItem(
        item.itemId,
        item.modelType,
        item.itemType,
        itemStream,
        item.parentId,
        item.mutations
      );
    }
  }

  private _beginRecordingItemModelMutations (itemId: ItemID) {
    assert(!this._modelMutations.has(itemId), `Already recording model mutations for item ${itemId}`);
    this._modelMutations.set(itemId, []);
  }

  private _recordModelMutation (itemId: ItemID, mutation: ModelMessage<Uint8Array>) {
    const list = this._modelMutations.get(itemId);
    if (list) {
      list.push(mutation);
    }
  }
}

function sortItemsTopologically (items: ItemSnapshot[]): ItemSnapshot[] {
  const res: ItemSnapshot[] = [];
  const seenIds = new Set<ItemID>();

  while (res.length !== items.length) {
    const prevLength = res.length;
    for (const item of items) {
      assert(item.itemId);
      if (!seenIds.has(item.itemId) && (item.parentId == null || seenIds.has(item.parentId))) {
        res.push(item);
        seenIds.add(item.itemId);
      }
    }
    if (prevLength === res.length && res.length !== items.length) {
      throw new Error('Cannot topologically sorts items in snapshot: some parents are missing.');
    }
  }

  return res;
}
