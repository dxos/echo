//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import pify from 'pify';

// TODO(burdon): Rename EventHandler.
import { Event } from '@dxos/async';

import { ItemID } from '../items';
import { IFeedMeta } from '../feeds';
import { createWritable } from '../util';

import { dxos } from '../proto/gen/testing';

const log = debug('dxos:echo:model');

//
// Types
//

export type ModelType = string;

export type ModelConstructor<T> = new (itemId: ItemID, writable?: NodeJS.WritableStream) => T;

export type ModelMessage<T> = {
  meta: IFeedMeta,
  mutation: T
}

/**
 * Abstract base class for Models.
 */
export abstract class Model<T> {
  static type: ModelType;

  private readonly _onUpdate = new Event<Model<T>>();
  private readonly _processor: NodeJS.WritableStream;

  constructor (
    private _itemId: ItemID,
    private _writable?: NodeJS.WritableStream
  ) {
    assert(this._itemId);

    this._processor = createWritable<ModelMessage<T>>(async (message: ModelMessage<T>) => {
      const { meta, mutation } = message;
      await this.processMessage(meta, mutation);
    });
  }

  get itemId (): ItemID {
    return this._itemId;
  }

  get readOnly (): boolean {
    return this._writable !== undefined;
  }

  // TODO(burdon): Rename.
  get processor (): NodeJS.WritableStream {
    return this._processor;
  }

  // TODO(burdon): Factor out.
  subscribe (listener: (result: Model<T>) => void) {
    this._onUpdate.on(listener);
    return () => {
      this._onUpdate.off(listener);
    };
  }

  /**
   * Wraps the message within an ItemEnvelope then writes to the output stream.
   * @param mutation
   */
  protected async write (mutation: T): Promise<void> {
    assert(this._writable, 'Read-only model');
    await pify(this._writable.write.bind(this._writable))(mutation);
  }

  /**
   *
   * @protected
   */
  protected update () {
    this._onUpdate.emit(this);
  }

  /**
   * Process the message.
   * @abstract
   * @param {Object} meta
   * @param {Object} mutation
   */
  async abstract processMessage (meta: IFeedMeta, mutation: T): Promise<void>;
}
