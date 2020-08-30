//
// Copyright 2020 DXOS.org
//

import { createAny } from '@dxos/experimental-util';

import { ItemID, ItemType } from '../types';
import { dxos } from './proto';

//
// ECHO generators.
//

export const createItemGenesis = (itemId: ItemID, itemType: ItemType): dxos.IFeedMessage => ({
  echo: {
    genesis: {
      itemType
    }
  }
});

//
// Testing.
//

export const createTestItemMutation = (
  itemId: ItemID, key: string, value: string, timeframe?: dxos.echo.ITimeframe
): dxos.IFeedMessage => ({
  echo: {
    itemId,
    timeframe,
    mutation: createAny<dxos.echo.testing.ITestItemMutation>({
      key,
      value
    }, 'dxos.echo.testing.TestItemMutation')
  }
});
