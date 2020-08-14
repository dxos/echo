//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import pify from 'pify';

import { Event } from '@dxos/async';

import { ItemID } from '../items';
import { IFeedMeta } from '../feeds';
import { createWritable } from '../util';
import { ModelMessage, ModelType } from './types';

/**
 * Abstract base class for Models.
 * Models define a root message type, which is contained in the partent Item's message envelope.
 */
export abstract class Model<T> {
  static type: ModelType;

  private readonly _modelUpdate = new Event<Model<T>>();
  private readonly _processor: NodeJS.WritableStream;

  /**
   * @param _itemId Parent item.
   * @param _writable Output mutation stream.
   */
  constructor (
    private _itemId: ItemID,
    private _writable?: NodeJS.WritableStream
  ) {
    assert(this._itemId);

    // Create the input mutation stream.
    this._processor = createWritable<ModelMessage<T>>(async (message: ModelMessage<T>) => {
      const { meta, mutation } = message;
      assert(meta);
      assert(mutation);

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
    this._modelUpdate.on(listener);
    return () => {
      this._modelUpdate.off(listener);
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
    this._modelUpdate.emit(this);
  }

  /**
   * Process the message.
   * @abstract
   * @param {Object} meta
   * @param {Object} mutation
   */
  async abstract processMessage (meta: IFeedMeta, mutation: T): Promise<void>;
}
