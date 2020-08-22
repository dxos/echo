//
// Copyright 2020 DXOS.org
//

import { dxos, ItemID } from '@dxos/experimental-echo-protocol';
import { createMessage } from '@dxos/experimental-util';

export const createSetPropertyMutation =
  (itemId: ItemID, key: string, value: string, timeframe?: dxos.echo.ITimeframe) =>
    createMessage<dxos.IFeedMessage>({
      echo: {
        timeframe,
        itemId,
        itemMutation: {
          set: {
            key,
            value
          }
        }
      }
    });

export const createAppendPropertyMutation =
  (itemId: ItemID, key: string, value: string, timeframe?: dxos.echo.ITimeframe) =>
    createMessage<dxos.IFeedMessage>({
      echo: {
        timeframe,
        itemId,
        itemMutation: {
          append: {
            key,
            value
          }
        }
      }
    });
