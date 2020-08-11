//
// Copyright 2020 DXOS.org
//

import { createKeyPair } from '@dxos/crypto';

import { ResultSet } from './result';
import { Item, ItemID } from './items';
import { Event } from '@dxos/async';

/**
 * Party
 */
export class Party {
  private readonly _update = new Event();
  private readonly _key: Buffer = createKeyPair().publicKey;
  private readonly _items = new Map<ItemID, Item>();

  get key (): Buffer {
    return this._key;
  }

  async open () {}

  async close () {}

  async createItem (type: string): Promise<Item> {
    const item = new Item(type);
    this._items.set(item.id, item);
    this._update.emit();
    return item;
  }

  async queryItems (filter?: any): Promise<ResultSet<Item>> {
    const { type } = filter || {};
    return new ResultSet<Item>(this._update, () => Array.from(this._items.values()).filter(item => !type || type === item.type));
  }
}
