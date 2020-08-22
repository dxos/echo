//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';

import { dxos, FeedMeta } from '@dxos/experimental-echo-protocol';
import { ModelType, Model } from '@dxos/experimental-model-factory';
import { checkType, jsonReplacer } from '@dxos/experimental-util';

import { MutationUtil, ValueUtil } from './mutation';

const log = debug('dxos:echo:object-model');

/**
 * Object mutation model.
 */
export class ObjectModel extends Model<dxos.echo.IObjectMutation> {
  static type: ModelType = 'wrn://dxos.org/model/object';

  private _object = {};

  /**
   * Returns an immutable object.
   */
  toObject () {
    return cloneDeep(this._object);
  }

  /**
   * Returns the value at `path` of the object.
   * Similar to: https://lodash.com/docs/4.17.15#get
   * @param path
   * @param [defaultValue]
   */
  getProperty (path: string, defaultValue: any = undefined): any {
    return cloneDeep(get(this._object, path, defaultValue));
  }

  // TODO(burdon): Create builder pattern (replace static methods).
  async setProperty (key: string, value: any) {
    await this.write(checkType<dxos.echo.ObjectMutation>({
      mutations: [
        {
          operation: dxos.echo.ObjectMutation.Operation.SET,
          key,
          value: ValueUtil.createMessage(value)
        }
      ]
    }));
  }

  async _processMessage (meta: FeedMeta, messsage: dxos.echo.IObjectMutation) {
    log('processMessage', JSON.stringify({ meta, messsage }, jsonReplacer));
    const { mutations } = messsage;
    MutationUtil.applyMutations(this._object, mutations!);
    return true;
  }
}
