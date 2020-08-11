//
// Copyright 2020 DXOS.org
//

import { EventEmitter } from 'events';

import { createKeyPair } from '@dxos/crypto';

import { ResultSet } from './result';
import { Item, ItemID } from './items';

/**
 * Party
 */
export class Party {
  _listeners = new EventEmitter();
  _key: Buffer = createKeyPair().publicKey;
  _items = new Map<ItemID, Item>();

  get key (): Buffer {
    return this._key;
  }

  async open () {}

  async close () {}

  async createItem (type: string): Promise<Item> {
    const item = new Item(type);
    this._items.set(item.id, item);
    setImmediate(() => this._listeners.emit('update:item', this));
    return item;
  }

  async queryItems (filter?: any): Promise<ResultSet<Item>> {
    const { type } = filter || {};
    return new ResultSet<Item>(this._listeners,
      'item', () => Array.from(this._items.values()).filter(item => !type || type === item.type));
  }
}
