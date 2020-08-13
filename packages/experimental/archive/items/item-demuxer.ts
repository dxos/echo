//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import { Readable, Writable } from 'stream';

import { dxos } from '@dxos/experimental/src/proto/gen/testing';

import { ItemID } from '@dxos/experimental/dist/types';
import { LazyMap } from '@dxos/experimental/dist/util';

import { ItemManager } from './item-manager';

const log = debug('dxos:echo:item');

/**
 * Creates a stream that consumes item messages.
 * @param itemManager
 */
export const createItemDemuxer = (itemManager: ItemManager): Writable => {
  // TODO(burdon): Get stream from item's model directly.
  // TODO(burdon): Should be impossible to get message before stream is created.
  // Map of Item-specific streams.
  const itemStreamMap = new LazyMap<ItemID, Readable>(() => new Readable({
    objectMode: true,
    read () {}
  }));

  const process = async (meta, message: dxos.echo.testing.IEchoEnvelope) => {
    const { itemId, genesis, mutation } = message;

    assert(itemId);
    const itemStream = itemStreamMap.getOrInit(itemId);

    if (genesis) {
      const { itemType, modelType } = genesis;
      assert(itemType && modelType);
      const item = await itemManager.constructItem(itemId, itemType, modelType, itemStream);
      assert(item.id === itemId);
      return;
    }

    if (mutation) {
      await itemStream.push({ meta, mutation });
      return;
    }

    throw new Error(`Unexpected message: ${JSON.stringify(message)}`);
  };

  // TODO(burdon): Should this implement some "back-pressure" (hints) to the PartyProcessor?
  return new Writable({
    objectMode: true,
    write: async (message: dxos.echo.testing.IFeedStream, _, callback) => {
      log('Demuxer.write:', JSON.stringify(message));
      assert(message.data && message.data.echo);
      const { meta, data: { echo } } = message;
      await process(meta, echo);
      callback();
    }
  });
};
