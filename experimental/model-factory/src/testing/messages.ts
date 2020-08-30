//
// Copyright 2020 DXOS.org
//

import { dxos as protocol, ItemID } from '@dxos/experimental-echo-protocol';

export const createSetPropertyMutation = (
  itemId: ItemID, key: string, value: string, timeframe?: protocol.dxos.echo.ITimeframe
): protocol.dxos.IFeedMessage => ({
    echo: {
      timeframe,
      itemId,
      itemMutation: {
        key,
        value
      }
    }
  });
