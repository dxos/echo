//
// Copyright 2020 DXOS.org
//

import { sleep } from '@dxos/async';

import { Model } from '../models';

import { dxos } from '../proto/gen/testing';

/**
 * Test model.
 */
export class TestModel extends Model<dxos.echo.testing.ITestItemMutation> {
  // TODO(burdon): Format?
  static type = 'wrn://dxos.io/model/test';

  _values = new Map();

  get keys () {
    return Array.from(this._values.keys());
  }

  get value () {
    return Object.fromEntries(this._values);
  }

  getValue (key: string) {
    return this._values.get(key);
  }

  async processMessage (meta: dxos.echo.testing.IFeedMeta, mutation: dxos.echo.testing.ITestItemMutation) {
    const { key, value } = mutation;

    await sleep(50);
    this._values.set(key, value);
  }

  async setProperty (key: string, value: string) {
    await this.write({
      key,
      value
    });
  }
}
