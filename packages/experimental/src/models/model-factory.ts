//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import { Constructor } from 'protobufjs';

import { ItemID, ModelType } from '../types';
import { Model } from './model';

const log = debug('dxos:echo:model');

/**
 * Creates Model instances from a registered collection of Model types.
 */
export class ModelFactory {
  private _models = new Map<string, Constructor<Model>>();

  registerModel (type: ModelType, modelConstructor: Constructor<Model>): ModelFactory {
    assert(type);
    assert(modelConstructor);
    this._models.set(type, modelConstructor);
    return this;
  }

  // TODO(burdon): Require version.
  createModel (type: ModelType, itemId: ItemID, readable: NodeJS.ReadableStream, writable?: NodeJS.WritableStream) {
    const modelConstructor = this._models.get(type);
    if (modelConstructor) {
      // eslint-disable-next-line new-cap
      return new modelConstructor(itemId, readable, writable);
    }
  }
}
