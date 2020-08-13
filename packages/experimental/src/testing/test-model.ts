//
// Copyright 2020 DXOS.org
//

import { sleep } from '@dxos/async';

import { Model, ModelType } from '../models';

import { dxos } from '../proto/gen/testing';

/**
 * Test model.
 */
export class TestModel extends Model<dxos.echo.testing.IItemMutation> {
  // TODO(burdon): WRN Format?
  static type: ModelType = 'wrn://dxos.io/model/test';

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
    await this.write({
      key,
      value
    });
  }

  async processMessage (meta: dxos.echo.testing.IFeedMeta, mutation: dxos.echo.testing.IItemMutation) {
    const { key, value } = mutation;

    await sleep(50);
    this._values.set(key, value);
    super.update();
  }
}
