//
// Copyright 2020 DXOS.org
//

import { EventEmitter } from 'events';

import { createId, createKeyPair } from '@dxos/crypto';

type ItemID = string;

/**
 * Database
 */
export class Database extends EventEmitter {
  _parties = new Map<Buffer, Party>();

  async createParty () {
    const party = new Party();
    this._parties.set(party.key, party);
    setImmediate(() => this.emit('update:party', this));
    return party;
  }

  async queryParties (filter?: any) {
    return new Query<Party>(this, 'party', () => Array.from(this._parties.values()));
  }
}

/**
 * Party
 */
export class Party extends EventEmitter {
  _key: Buffer = createKeyPair().publicKey;
  _items = new Map<ItemID, Item>();

  get key (): Buffer {
    return this._key;
  }

  async open () {}

  async close () {}

  async createItem (type: string) {
    const item = new Item(type);
    this._items.set(item.id, item);
    setImmediate(() => this.emit('update:item', this));
    return item;
  }

  async queryItems (filter?: any) {
    const { type } = filter || {};
    return new Query<Item>(
      this, 'item', () => Array.from(this._items.values()).filter(item => !type || type === item.type));
  }
}

/**
 * Item
 */
export class Item extends EventEmitter {
  _id: ItemID = createId();

  constructor (private _type: string) {
    super();
  }

  get id (): ItemID {
    return this._id;
  }

  get type (): string {
    return this._type;
  }
}

/**
 * Query
 */
export class Query<T> extends EventEmitter {
  _value: T[];
  _handleUpdate: (value: T[]) => void;

  constructor (
    private _eventEmitter: EventEmitter,
    private _type: string,
    private _getter: () => T[]
  ) {
    super();
    this._value = this._getter();
    this._handleUpdate = () => {
      this._value = this._getter();
      this.emit('update', this);
    };
  }

  get value (): T[] {
    return this._value;
  }

  // TODO(burdon): Handle.

  on (event: string, listener: (...args: any[]) => void) {
    super.on(event, listener);
    if (event === 'update' && super.listenerCount(event) === 1) {
      this._eventEmitter.on(`update:${this._type}`, this._handleUpdate);
    }

    return this;
  }

  off (event: string, listener: (...args: any[]) => void) {
    super.off(event, listener);
    if (event === 'update' && super.listenerCount(event) === 0) {
      this._eventEmitter.off(`update:${this._type}`, this._handleUpdate);
    }

    return this;
  }
}
