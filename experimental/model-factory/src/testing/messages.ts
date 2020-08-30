//
// Copyright 2020 DXOS.org
//

import { dxos as prototol_dxos, ItemID } from '@dxos/experimental-echo-protocol';

export const createSetPropertyMutation = (
  itemId: ItemID, key: string, value: string, timeframe?: prototol_dxos.echo.ITimeframe
): prototol_dxos.IFeedMessage => ({
    echo: {
      timeframe,
      itemId,
      itemMutation: {
        key,
        value
      }
    }
  });
