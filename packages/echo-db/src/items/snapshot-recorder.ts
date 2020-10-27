//
// Copyright 2020 DXOS.org
//

import { assert } from 'console';

import { DatabaseSnapshot, ItemID, ModelMutation } from '@dxos/echo-protocol';
import { ModelMessage } from '@dxos/model-factory';

import { ItemManager } from './item-manager';

export class DatabaseSnasphotRecorder {
  /**
   * Records model mutations for snapshots.
   * This array is only there if model doesn't have its own snapshot implementation.
   */
  private readonly _modelMutations = new Map<ItemID, ModelMutation[]>();

  constructor (
    private readonly _itemManager: ItemManager
  ) {}

  beginRecordingItemModelMutations (itemId: ItemID) {
    assert(!this._modelMutations.has(itemId), `Already recording model mutations for item ${itemId}`);
    this._modelMutations.set(itemId, []);
  }

  recordModelMutation (itemId: ItemID, mutation: ModelMessage<Uint8Array>) {
    const list = this._modelMutations.get(itemId);
    if (list) {
      list.push(mutation);
    }
  }

  makeSnapshot (): DatabaseSnapshot {
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
}
