//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';

import { ItemID } from '../types';
import { ModelType, ModelConstructor } from './model';

const log = debug('dxos:echo:model');

/**
 * Creates Model instances from a registered collection of Model types.
 */
export class ModelFactory {
  private _models = new Map<ModelType, ModelConstructor<any>>();

  // TODO(burdon): Require version.

  hasModel (modelType: ModelType) {
    assert(modelType);
    return this._models.has(modelType);
  }

  registerModel (modelType: ModelType, modelConstructor: ModelConstructor<any>): ModelFactory {
    assert(modelType);
    assert(modelConstructor);
    this._models.set(modelType, modelConstructor);
    return this;
  }

  createModel<T> (modelType: ModelType, itemId: ItemID, writable?: NodeJS.WritableStream): T {
    const modelConstructor = this._models.get(modelType) as ModelConstructor<T>;
    if (!modelConstructor) {
      throw new Error(`Invalid model: ${modelType}`);
    }

    // eslint-disable-next-line new-cap
    return new modelConstructor(itemId, writable);
  }
}
