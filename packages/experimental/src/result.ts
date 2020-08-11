//
// Copyright 2020 DXOS.org
//

import { EventEmitter } from 'events';

/**
 * Query results.
 */
export class ResultSet<T> {
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
      this._listeners.emit('update', this._value);
    };
  }

  get value (): T[] {
    return this._value;
  }

  /**
   * Subscribe for updates.
   * @param listener
   */
  subscribe (listener: (result: T[]) => void) {
    this._listeners.on('update', listener);
    if (this._listeners.listenerCount('update') === 1) {
      this._eventEmitter.on(`update:${this._type}`, this._handleUpdate);
    }

    return () => {
      this._listeners.off('update', listener);
      if (this._listeners.listenerCount('update') === 0) {
        this._eventEmitter.off(`update:${this._type}`, this._handleUpdate);
      }
    };
  }
}
