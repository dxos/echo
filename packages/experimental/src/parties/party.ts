//
// Copyright 2020 DXOS.org
//

import { Event } from '@dxos/async';
import { createId, createKeyPair } from '@dxos/crypto';

import { Item, ItemID, ItemType } from '../items';
import { ResultSet } from '../result';
import { Model, ModelFactory, ModelType } from '../models';

/**
 * Party.
 */
export class Party {
  private readonly _update = new Event();
  // TODO(burdon): From halo.
  private readonly _key: Buffer = createKeyPair().publicKey;
  // TODO(burdon): Item manager.
  private readonly _items = new Map<ItemID, Item>();

  constructor (
    private readonly _modelFactory: ModelFactory
  ) {}

  get key (): Buffer {
    return this._key;
  }

  async createItem (itemType: ItemType, modelType: ModelType): Promise<Item> {
    const itemId = createId();
    const model = this._modelFactory.createModel(modelType, itemId);
    const item = new Item(itemId, itemType, model);
    this._items.set(item.id, item);
    this._update.emit();
    return item;
  }

  async queryItems (filter?: any): Promise<ResultSet<Item>> {
    const { type } = filter || {};
    return new ResultSet<Item>(this._update, () => Array.from(this._items.values())
      .filter(item => !type || type === item.type));
  }
}
