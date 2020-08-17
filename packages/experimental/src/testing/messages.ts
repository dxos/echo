//
// Copyright 2020 DXOS.org
//

import { dxos } from '../proto/gen/testing';

import { ItemID } from '../items';
import { createMessage } from '../proto';

//
// HALO generators.
//

//
// ECHO generators.
//

export const createSetPropertyMutation =
  (itemId: ItemID, key: string, value: string, timeframe?: dxos.echo.testing.ITimeframe) =>
    createMessage<dxos.echo.testing.IFeedMessage>({
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
  (itemId: ItemID, key: string, value: string, timeframe?: dxos.echo.testing.ITimeframe) =>
    createMessage<dxos.echo.testing.IFeedMessage>({
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
