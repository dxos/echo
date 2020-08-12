//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import { EventEmitter } from 'events';
import pify from 'pify';
import { Transform } from 'stream';

import { ItemID, ModelType } from '../types';

import { dxos } from '../proto/gen/testing';

const log = debug('dxos:echo:model');

/**
 * Abstract base class for Models.
 */
export abstract class Model extends EventEmitter {
  static type: ModelType;

  constructor (
    private _itemId: ItemID,
    private _readable: NodeJS.ReadableStream,
    private _writable?: NodeJS.WritableStream // TODO(burdon): Read-only if undefined?
  ) {
    super();
    assert(this._itemId);

    this._readable.pipe(new Transform({
      objectMode: true,
      transform: async (message: dxos.echo.testing.IItemOperationEnvelope, _, callback) => {
        await this.processMessage(message);

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
   * @param message
   */
  async write (message: any): Promise<void> {
    assert(this._writable);
    await pify(this._writable.write.bind(this._writable))(message);
  }

  /**
   * Process the message.
   * @abstract
   * @param {Object} message
   */
  async abstract processMessage (message: dxos.echo.testing.IItemOperationEnvelope): Promise<void>;
}
