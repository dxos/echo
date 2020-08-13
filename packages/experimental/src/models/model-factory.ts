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
  private _models = new Map<string, Constructor<Model<any>>>();

  // TODO(burdon): Require version.

  hasModel (modelType: ModelType) {
    assert(modelType);
    return this._models.has(modelType);
  }

  registerModel (modelType: ModelType, modelConstructor: Constructor<Model<any>>): ModelFactory {
    assert(modelType);
    assert(modelConstructor);
    this._models.set(modelType, modelConstructor);
    return this;
  }

  createModel (modelType: ModelType, itemId: ItemID, readable: NodeJS.ReadableStream, writable?: NodeJS.WritableStream) {
    const modelConstructor = this._models.get(modelType);
    if (modelConstructor) {
      // eslint-disable-next-line new-cap
      return new modelConstructor(itemId, readable, writable);
    }
  }
}
