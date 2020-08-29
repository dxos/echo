//
// Copyright 2020 DXOS.org
//

import { createAny } from '@dxos/experimental-util';

import { dxos as protocol_dxos } from './gen/dxos';
import { ItemID, ItemType } from '../types';

//
// ECHO generators.
//

export const createItemGenesis = (itemId: ItemID, itemType: ItemType): protocol_dxos.IFeedMessage => ({
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
  itemId: ItemID, key: string, value: string, timeframe?: protocol_dxos.echo.ITimeframe
): protocol_dxos.IFeedMessage => ({
  echo: {
    itemId,
    timeframe,
    mutation: createAny<protocol_dxos.echo.testing.ITestItemMutation>({
      key,
      value
    }, 'dxos.echo.testing.TestItemMutation')
  }
});
