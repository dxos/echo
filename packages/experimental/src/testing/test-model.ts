//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { sleep } from '@dxos/async';

import { assertTypeUrl } from '../util';
import { Model } from '../models';

import { dxos } from '../proto/gen/testing';

/**
 * Test model.
 */
export class TestModel extends Model {
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

  async processMessage (envelope: dxos.echo.testing.IItemOperationEnvelope) {
    const mutation = envelope.operation as dxos.echo.testing.ITestItemMutation;
    assert(mutation);
    assertTypeUrl(mutation, 'dxos.echo.testing.TestItemMutation');
    const { key, value } = mutation;

    await sleep(50);
    this._values.set(key, value);
  }

  async setProperty (key: string, value: string) {
    await this.write({
      __type_url: 'dxos.echo.testing.TestItemMutation',
      key,
      value
    });
  }
}
