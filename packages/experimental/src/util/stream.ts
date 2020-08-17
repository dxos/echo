//
// Copyright 2020 DXOS.org
//

import { Readable, Writable, Transform } from 'stream';

/**
 * Create a readable stream.
 */
export function createReadable<T> (): Readable {
  return new Readable({
    objectMode: true,
    read () {}
  });
}

/**
 * Creates a writable object stream.
 * @param callback
 */
export function createWritable<T> (callback: (message: T) => Promise<void>): NodeJS.WritableStream {
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
 * @param [callback] Callback or null to pass-through.
 */
export function createTransform<R, W> (callback: (message: R) => Promise<W | undefined> | undefined) {
  return new Transform({
    objectMode: true,
    transform: async (message: R, _, next) => {
      try {
        next(null, callback ? await callback(message) : message);
      } catch (err) {
        next(err);
      }
    }
  });
}

/**
 * Injectable logger.
 * @param logger
 */
export function createLoggingTransform (logger: Function = console.log) {
  return createTransform<any, any>(message => {
    logger(message);
    return message;
  });
}

/**
 * Wriable stream that collects objects (e.g., for testing).
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
