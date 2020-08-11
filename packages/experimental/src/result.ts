//
// Copyright 2020 DXOS.org
//

import { Event } from '@dxos/async';

/**
 * Query results.
 */
export class ResultSet<T> {
  private _value: T[];
  private _handleUpdate: () => void;
  private readonly _update = new Event<T[]>();

  constructor (
    private _event: Event,
    private _getter: () => T[]
  ) {
    this._value = this._getter();
    this._handleUpdate = () => {
      this._value = this._getter();
      this._update.emit(this._value);
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
    this._update.on(listener);
    if (this._update.listenerCount() === 1) {
      this._event.on(this._handleUpdate);
    }

    return () => {
      this._update.off(listener);
      if (this._update.listenerCount() === 0) {
        this._event.off(this._handleUpdate);
      }
    };
  }
}
