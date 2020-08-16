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

export const createItemMutation = (itemId: ItemID, key: string, value: string) =>
  createMessage<dxos.echo.testing.IFeedMessage>({
    echo: {
      itemId,
      itemMutation: {
        set: {
          key,
          value
        }
      }
    }
  });
