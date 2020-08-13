//
// Copyright 2020 DXOS.org
//

import { Event } from '@dxos/async';
import { createId, createKeyPair } from '@dxos/crypto';

import { Item } from '../items';
import { ResultSet } from '../../src/result';
import { ItemID } from '../../src/types';

/**
 * Party.
 */
export class Party {
  private readonly _update = new Event();
  private readonly _key: Buffer = createKeyPair().publicKey;
  private readonly _items = new Map<ItemID, Item>();

  get key (): Buffer {
    return this._key;
  }

  // TODO(burdon): ???
  async open () {}
  async close () {}

  async createItem (type: string): Promise<Item> {
    const itemId = createId();
    const item = new Item(itemId, type, null);
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
