//
// Copyright 2020 DXOS.org
//

import { Feed } from 'hypercore';
import { PassThrough, Readable, Transform, Writable } from 'stream';

//
// Stream utils.
// https://nodejs.org/api/stream.html
//

/**
 * Returns a stream that appends messages directly to a hypercore feed.
 * @param feed
 * @returns {NodeJS.WritableStream}
 */
// TODO(burdon): Move to @dxos/codec.
export const createWritableFeedStream = (feed: Feed) => new Writable({
  objectMode: true,
  write (message, _, callback) {
    feed.append(message, callback);
  }
});

/**
 * Creates a statically checked message, with optional ANY type.
 * @param data
 * @param typeUrl
 */
// TODO(burdon): Move to @dxos/codec.
export function createMessage<T> (data: T, typeUrl?: string): T {
  return typeUrl ? Object.assign({
    __type_url: typeUrl
  }, data) : data;
}

/**
 * Creates a readable stream that can be used as a buffer into which messages can be pushed.
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
 * Creates a no-op transform.
 */
export function createPassThrough<T> (): PassThrough {
  return new PassThrough({
    objectMode: true,
    transform: async (message: T, _, next) => {
      next(null, message);
    }
  });
}

/**
 * Creates a transform object stream.
 * @param [callback] Callback or null to pass-through.
 */
export function createTransform<R, W> (callback: (message: R) => Promise<W | undefined> | undefined): Transform {
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
export function createLoggingTransform (logger: Function = console.log): Transform {
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
