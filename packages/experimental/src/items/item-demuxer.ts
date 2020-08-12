//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import { Readable, Writable } from 'stream';

import { ItemID } from '../types';
import { assertAnyType, assumeType, LazyMap } from '../util';
import { dxos } from '../proto/gen/testing';

import { ItemManager } from './item-manager';

const log = debug('dxos:echo:item');

/**
 * Reads party stream and routes to associate item stream.
 * @param itemManager
 */
export const createItemDemuxer = (itemManager: ItemManager) => {
  // Map of Item-specific streams.
  const itemStreams = new LazyMap<ItemID, Readable>(() => new Readable({ objectMode: true, read () {} }));

  // TODO(burdon): Should this implement some "back-pressure" (hints) to the PartyProcessor?
  return new Writable({
    objectMode: true,
    write: async (message: dxos.echo.testing.IFeedMessage, _, callback) => {
      assertAnyType<dxos.echo.testing.IItemEnvelope>(message, 'dxos.echo.testing.FeedMessage');
      log('Demuxer.write:', JSON.stringify(message));
      const { itemId, genesis, mutation } = message;
      assert(itemId);
      const stream = itemStreams.getOrInit(itemId);

      //
      // Item genesis
      //
      if (genesis) {
        const { itemType, modelType } = genesis;
        assert(itemType && modelType);
        const item = await itemManager.constructItem(itemId, itemType, modelType, stream);
        assert(item.id === itemId);
        return;
      }

      //
      // Item mutation.
      //
      if (mutation) {
        stream.push({ envelope });
        return;
      }

      /* eslint-disable camelcase */
      const { __type_url } = operation as any;
      switch (__type_url) {
        //
        // Item mutation.
        //
        case 'dxos.echo.testing.TestItemMutation': {
          assumeType<dxos.echo.testing.ITestItemMutation>(operation);
          assert(operation);

          const stream = itemStreams.getOrInit(itemId);
          stream.push({ envelope: payload });
          break;
        }

        default:
          throw new Error(`Unexpected type: ${__type_url}`);
      }

      callback();
    }
  });
};
