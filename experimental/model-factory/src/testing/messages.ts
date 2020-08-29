//
// Copyright 2020 DXOS.org
//

import { protocol_dxos, ItemID } from '@dxos/experimental-echo-protocol';

export const createSetPropertyMutation =
  (itemId: ItemID, key: string, value: string, timeframe?: protocol_dxos.echo.ITimeframe): protocol_dxos.IFeedMessage => ({
    echo: {
      timeframe,
      itemId,
      itemMutation: {
        key,
        value
      }
    }
  });
