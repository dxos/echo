//
// Copyright 2020 DXOS.org
//

import debug from 'debug';

import { Model, IFeedMeta } from '@dxos/echo-experimental';

import { dxos } from './proto';

const log = debug('dxos:echo:object-model');

/**
 * Object mutation model.
 */
export class ObjectModel extends Model<dxos.echo.IObjectMutation> {
  async processMessage (meta: IFeedMeta, mutation: dxos.echo.IObjectMutation): Promise<void> {
    log('processMessage', meta, mutation);
  }
}
