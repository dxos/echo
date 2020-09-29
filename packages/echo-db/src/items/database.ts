//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { ItemID, ItemType } from '@dxos/echo-protocol';
import { Model, ModelConstructor } from '@dxos/model-factory';

import { ResultSet } from '../result';
import { Item } from './item';
import { ItemFilter, ItemManager } from './item-manager';

export class Database {
  constructor (
    private readonly _itemManager: ItemManager | undefined
  ) {}

  /**
   * Creates a new item with the given queryable type and model.
   * @param {ModelType} model
   * @param {ItemType} [itemType]
   * @param {ItemID} [parentId]
   */
  // TODO(burdon): Get modelType from somewhere other than ObjectModel.meta.type.
  // TODO(burdon): Pass in { type, parent } as options.
  async createItem <M extends Model<any>> (
    model: ModelConstructor<M>,
    itemType?: ItemType | undefined,
    parentId?: ItemID | undefined
  ): Promise<Item<M>> {
    assert(this._itemManager, 'Database not open.');

    return this._itemManager.createItem(model.meta.type, itemType, parentId);
  }

  /**
   * Queries for a set of Items matching the optional filter.
   * @param filter
   */
  queryItems (filter?: ItemFilter): ResultSet<Item<any>> {
    assert(this._itemManager, 'Database not open.');

    return this._itemManager.queryItems(filter);
  }

  /**
   * Retrieves a item from the index.
   * @param itemId
   */
  getItem (itemId: ItemID): Item<any> | undefined {
    assert(this._itemManager, 'Database not open.');

    return this._itemManager.getItem(itemId);
  }
}
