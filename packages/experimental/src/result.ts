//
// Copyright 2020 DXOS.org
//

// TODO(burdon): Rename EventHandler.
import { Event } from '@dxos/async';

/**
 * Query results.
 */
export class ResultSet<T> {
  private _value: T[];
  private _handleUpdate: () => void;
  private readonly _onUpdate = new Event<T[]>();

  constructor (
    private _onParentUpdate: Event,
    private _getter: () => T[]
  ) {
    this._value = this._getter();
    this._handleUpdate = () => {
      this._value = this._getter();
      this._onUpdate.emit(this._value);
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
    this._onUpdate.on(listener);
    if (this._onUpdate.listenerCount() === 1) {
      this._onParentUpdate.on(this._handleUpdate);
    }

    return () => {
      this._onUpdate.off(listener);
      if (this._onUpdate.listenerCount() === 0) {
        this._onParentUpdate.off(this._handleUpdate);
      }
    };
  }
}
