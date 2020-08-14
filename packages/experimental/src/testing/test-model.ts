//
// Copyright 2020 DXOS.org
//

import { sleep } from '@dxos/async';

import { dxos } from '../proto/gen/testing';

import { IFeedMeta } from '../feeds';
import { Model, ModelType } from '../models';
import { createMessage } from '../proto';

/**
 * Test model.
 */
export class TestModel extends Model<dxos.echo.testing.IItemMutation> {
  // TODO(burdon): WRN Format?
  static type: ModelType = 'dxos://dxos.org/model/test';

  private _values = new Map();

  get keys () {
    return Array.from(this._values.keys());
  }

  get properties () {
    return Object.fromEntries(this._values);
  }

  getProperty (key: string) {
    return this._values.get(key);
  }

  async setProperty (key: string, value: string) {
    await this.write(createMessage<dxos.echo.testing.IItemMutation>({
      key,
      value
    }, 'dxos.echo.testing.ItemMutation'));
  }

  async processMessage (meta: IFeedMeta, mutation: dxos.echo.testing.IItemMutation) {
    const { key, value } = mutation;
    await sleep(50);
    this._values.set(key, value);
    super.update();
  }
}
