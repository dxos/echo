//
// Copyright 2020 DXOS.org
//

import { LogicalClockStamp } from '../clock/logical-clock-stamp';
import { FeedKey, ItemID, ItemType } from '../types';
import { TestModel } from './test-model';

//
// Test generators.
//

export const createPartyAdmit = (feedKey: FeedKey) => ({
  payload: {
    __type_url: 'dxos.echo.testing.PartyAdmit',
    feedKey
  }
});

export const createPartyEject = (feedKey: FeedKey) => ({
  payload: {
    __type_url: 'dxos.echo.testing.PartyEject',
    feedKey
  }
});

export const createItemGenesis = (itemId: ItemID, itemType: ItemType, timestamp?: LogicalClockStamp) => ({
  payload: {
    __type_url: 'dxos.echo.testing.ItemEnvelope',
    itemId,
    timestamp: timestamp ? LogicalClockStamp.encode(timestamp) : undefined,
    genesis: {
      itemType,
      modelType: TestModel.type
    }
  }
});

export const createTestItemMutation = (itemId: ItemID, key: string, value: string, timestamp?: LogicalClockStamp) => ({
  payload: {
    __type_url: 'dxos.echo.testing.ItemEnvelope',
    itemId,
    timestamp: timestamp ? LogicalClockStamp.encode(timestamp) : undefined,
    operation: {
      __type_url: 'dxos.echo.testing.TestItemMutation',
      key,
      value
    }
  }
});

//
// Basic testing
//

export const createTestMessage = (value: number) => ({
  payload: {
    __type_url: 'dxos.echo.testing.TestMessage',
    value
  }
});

export const createTestMessageWithTimestamp = (feedKey: Buffer, timestamp: LogicalClockStamp, value: number) => ({
  payload: {
    __type_url: 'dxos.echo.testing.ItemEnvelope',
    timestamp: LogicalClockStamp.encode(timestamp),
    operation: {
      __type_url: 'dxos.echo.testing.TestMessage',
      value
    }
  },
  feedKey
});

export const createExpectedFeedMessage = (data: any) => ({
  key: expect.any(Buffer),
  seq: expect.any(Number),
  sync: expect.any(Boolean),
  data
});
