//
// Copyright 2020 DXOS.org
//

import { Writable, Transform } from 'stream';

/**
 * Creates a writable object stream.
 * @param callback
 */
export function createWritable<T> (callback: (message: T) => Promise<void>) {
  return new Writable({
    objectMode: true,
    write: async (message: T, _, next) => {
      try {
        await callback(message);
        next();
      } catch (err) {
        next(err);
      }
    }
  });
}

/**
 * Creates a transform object stream.
 * @param callback
 */
export function createTransform<R, W> (callback: (message: R) => Promise<W>) {
  return new Transform({
    objectMode: true,
    transform: async (message: R, _, next) => {
      try {
        const out: W = await callback(message);
        next(null, out);
      } catch (err) {
        next(err);
      }
    }
  });
}

/**
 * Wriable stream that collects objects.
 */
export class WritableArray<T> extends Writable {
  _objects: T[] = [];

  constructor () {
    super({ objectMode: true });
  }

  clear () {
    this._objects = [];
  }

  get objects () {
    return this._objects;
  }

  _write (object: any, _: BufferEncoding, next: (error?: Error | null) => void): void {
    this._objects.push(object);
    next();
  }
}
