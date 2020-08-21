//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import cloneDeep from 'lodash/cloneDeep';

import { createMessage, Model, IFeedMeta } from '@dxos/echo-db-experimental';

import { dxos } from './proto';

import { MutationUtil, ValueUtil } from './mutation';

const log = debug('dxos:echo:object-model');

// Required to access property by variable.
export interface IIndexable {
  [key: string]: any;
}

/**
 * Object mutation model.
 */
export class ObjectModel extends Model<dxos.echo.IObjectMutation> {
  private _object: IIndexable = {};

  toObject () {
    return cloneDeep(this._object);
  }

  // TODO(burdon): Return immutable.
  getProperty (key: string): any {
    return this._object[key];
  }

  // TODO(burdon): Builder.
  async setProperty (key: string, value: any) {
    await this.write(createMessage<dxos.echo.IObjectMutation>({
      mutations: [
        {
          operation: dxos.echo.ObjectMutation.Operation.SET,
          key,
          value: ValueUtil.createMessage(value)
        }
      ]
    }, 'dxos.echo.ObjectMutation'));
  }

  async processMessage (meta: IFeedMeta, messsage: dxos.echo.IObjectMutation): Promise<void> {
    log('processMessage', meta, messsage);
    const { mutations } = messsage;
    MutationUtil.applyMutations(this._object, mutations!);
  }
}
