//
// Copyright 2020 DXOS.org
//

import { FeedMeta } from '@dxos/experimental-echo-protocol';
import { createMessage } from '@dxos/experimental-util';

import { dxos } from '../proto/gen/testing';

import { Model } from '../model';
import { ModelType } from '../types';

/**
 * Test model.
 */
export class TestModel extends Model<dxos.echo.testing.ITestItemMutation> {
  static type: ModelType = 'wrn://dxos.org/model/test';

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
    await this.write(createMessage<dxos.echo.testing.ITestItemMutation>({
      set: {
        key,
        value
      }
    }, 'dxos.echo.testing.TestItemMutation'));
  }

  async appendProperty (key: string, value: string) {
    await this.write(createMessage<dxos.echo.testing.ITestItemMutation>({
      append: {
        key,
        value
      }
    }, 'dxos.echo.testing.TestItemMutation'));
  }

  async _processMessage (meta: FeedMeta, message: dxos.echo.testing.ITestItemMutation) {
    if (message.set) {
      const { set: { key, value } } = message;
      this._values.set(key, value);
    }

    if (message.append) {
      const { append: { key, value } } = message;
      const current = this._values.get(key) || '';
      this._values.set(key, current + ':' + value);
    }

    return true;
  }
}
