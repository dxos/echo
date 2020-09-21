//
// Copyright 2020 DXOS.org
//

import { FeedMessage, ItemID, Timeframe } from '@dxos/experimental-echo-protocol';

export const createSetPropertyMutation = (
  itemId: ItemID, key: string, value: string, timeframe?: Timeframe
): FeedMessage => ({
  echo: {
    timeframe,
    itemId,
    itemMutation: {
      // key,
      // value
    }
  }
});
