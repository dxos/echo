//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import { EventEmitter } from 'events';
import pify from 'pify';
import { Writable } from 'stream';

import { ItemID, ModelType } from '../types';

import { dxos } from '../proto/gen/testing';

const log = debug('dxos:echo:model');

/**
 * Abstract base class for Models.
 */
export abstract class Model<T> extends EventEmitter {
  static type: ModelType;

  constructor (
    private _itemId: ItemID,
    private _readable: NodeJS.ReadableStream,
    private _writable?: NodeJS.WritableStream
  ) {
    super();
    assert(this._itemId);

    this._readable.pipe(new Writable({
      objectMode: true,
      write: async (message: dxos.echo.testing.IFeedStream, _, callback) => {
        const { meta, data } = message;
        assert(meta && data?.echo?.mutation);
        await this.processMessage(meta, data.echo.mutation as T);

        // TODO(burdon): Remove emitter.
        // TODO(burdon): Emit immutable value (or just ID).
        this.emit('update', this);
        callback();
      }
    }));
  }

  get itemId (): ItemID {
    return this._itemId;
  }

  get readOnly (): boolean {
    return this._writable !== undefined;
  }

  /**
   * Wraps the message within an ItemEnvelope then writes to the output stream.
   * @param mutation
   */
  protected async write (mutation: T): Promise<void> {
    assert(this._writable);
    await pify(this._writable.write.bind(this._writable))(mutation);
  }

  /**
   * Process the message.
   * @abstract
   * @param {Object} meta
   * @param {Object} mutation
   */
  async abstract processMessage (meta: dxos.echo.testing.IFeedMeta, mutation: T): Promise<void>;
}
