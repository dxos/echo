//
// Copyright 2020 DXOS.org
//

import { FeedKey, ItemID } from './database';
import { TestModel } from './test-model';

//
// Test generators.
// TODO(burdon): Move to testing.
//

export const createAdmit = (feedKey: FeedKey) => ({
  message: {
    __type_url: 'dxos.echo.testing.Admit',
    feedKey
  }
});

export const createRemove = (feedKey: FeedKey) => ({
  message: {
    __type_url: 'dxos.echo.testing.Remove',
    feedKey
  }
});

export const createItem = (itemId: ItemID) => ({
  message: {
    __type_url: 'dxos.echo.testing.ItemEnvelope',
    itemId,
    payload: {
      __type_url: 'dxos.echo.testing.ItemGenesis',
      model: TestModel.type
    }
  }
});

export const createMutation = (itemId: ItemID, key: string, value: string) => ({
  message: {
    __type_url: 'dxos.echo.testing.ItemEnvelope',
    itemId,
    payload: {
      __type_url: 'dxos.echo.testing.ItemMutation',
      key,
      value
    }
  }
});

// TODO(burdon): Use mutation instead.
export const createMessage = (data: number) => ({
  message: {
    __type_url: 'dxos.echo.testing.TestData',
    data
  }
});
