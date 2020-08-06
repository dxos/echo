//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import { trigger } from '@dxos/async';

// TODO(burdon): Factor out to @dxos/async. (also remove useValue).
export const latch = (n: number) => {
  assert(n > 0);

  let callback: (value: number) => void;
  const promise = new Promise<number>((resolve) => {
    callback = value => resolve(value);
  });

  let count = 0;
  return [
    promise,
    () => {
      if (++count === n) {
        callback(count);
      }
    }
  ] as const;
};

/**
 * A simple syntax sugar to write `value as T` as a statement
 * @param value
 */
// TODO(marik_d): Extract somewhere.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function assertType<T> (value: unknown): asserts value is T {}

// TODO(marik_d): Extract somewhere.
export class LazyMap<K, V> extends Map<K, V> {
  constructor (private _initFn: (key: K) => V) {
    super();
  }

  getOrInit (key: K): V {
    assert(key);

    if (this.has(key)) {
      return this.get(key)!;
    } else {
      const value = this._initFn(key);
      this.set(key, value);
      return value;
    }
  }
}

export class Trigger {
  _promise!: Promise<void>
  _wake!: () => void

  constructor () {
    this.reset();
  }

  wait () {
    return this._promise;
  }

  wake () {
    this._wake();
  }

  reset () {
    const [getPromise, wake] = trigger();
    this._promise = getPromise();
    this._wake = wake;
  }
}
