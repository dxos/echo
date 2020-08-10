//
// Copyright 2020 DXOS.org
//

import { EventEmitter } from 'events';

import { createId, createKeyPair } from '@dxos/crypto';

type ItemID = string;

// TODO(burdon): Remove EventEmitter.

/**
 * Database
 */
export class Database extends EventEmitter {
  _parties = new Map<Buffer, Party>();

  async createParty (): Promise<Party> {
    const party = new Party();
    this._parties.set(party.key, party);
    setImmediate(() => this.emit('update:party', this));
    return party;
  }

  async queryParties (filter?: any): Promise<Query<Party>> {
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

  async createItem (type: string): Promise<Item> {
    const item = new Item(type);
    this._items.set(item.id, item);
    setImmediate(() => this.emit('update:item', this));
    return item;
  }

  async queryItems (filter?: any): Promise<Query<Item>> {
    const { type } = filter || {};
    return new Query<Item>(this,
      'item', () => Array.from(this._items.values()).filter(item => !type || type === item.type));
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
export class Query<T> {
  _value: T[];
  _handleUpdate: (value: T[]) => void;
  _listeners = new EventEmitter();

  constructor (
    private _eventEmitter: EventEmitter,
    private _type: string,
    private _getter: () => T[]
  ) {
    this._value = this._getter();
    this._handleUpdate = () => {
      this._value = this._getter();
      this._listeners.emit('update', this);
    };
  }

  get value (): T[] {
    return this._value;
  }

  // TODO(burdon): Handle.

  on (event: string, listener: (...args: any[]) => void) {
    this._listeners.on(event, listener);
    if (event === 'update' && this._listeners.listenerCount(event) === 1) {
      this._eventEmitter.on(`update:${this._type}`, this._handleUpdate);
    }

    return this;
  }

  off (event: string, listener: (...args: any[]) => void) {
    this._listeners.off(event, listener);
    if (event === 'update' && this._listeners.listenerCount(event) === 0) {
      this._eventEmitter.off(`update:${this._type}`, this._handleUpdate);
    }

    return this;
  }
}
