//
// Copyright 2020 DXOS.org
//

import { any } from '@dxos/codec-protobuf';
import { createMessage } from '@dxos/experimental-util';

import { dxos } from './gen/dxos';
import { FeedKey, ItemID, ItemType, PartyKey } from '../types';

//
// HALO generators.
//

export const createPartyGenesis = (partyKey: PartyKey, feedKey: FeedKey) =>
  createMessage<dxos.IFeedMessage>({
    halo: {
      genesis: {
        partyKey,
        feedKey
      }
    }
  });

//
// ECHO generators.
//

// TODO(burdon): Use in code.
export const createItemGenesis = (itemId: ItemID, itemType: ItemType) =>
  createMessage<dxos.IFeedMessage>({
    echo: {
      genesis: {
        itemType
      }
    }
  });

//
// Testing.
//

export const createTestItemMutation = (itemId: ItemID, key: string, value: string, timeframe?: dxos.echo.ITimeframe) =>
  createMessage<dxos.IFeedMessage>({
    echo: {
      itemId,
      timeframe,
      customMutation: any(createMessage<dxos.echo.testing.ITestItemMutation>({
        key,
        value
      }, 'dxos.echo.testing.TestItemMutation'))
    }
  });
