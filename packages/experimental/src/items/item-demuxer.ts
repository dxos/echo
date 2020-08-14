//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import { Readable } from 'stream';

import { createReadable, createWritable } from '../util';
import { IEchoStream, ItemID } from './types';
import { ItemManager } from './item-manager';

const log = debug('dxos:echo:item');

/**
 * Creates a stream that consumes item messages.
 * @param itemManager
 */
export const createItemDemuxer = (itemManager: ItemManager): NodeJS.WritableStream => {
  assert(itemManager);

  const itemStreams = new Map<ItemID, Readable>();

  // TODO(burdon): Should this implement some "back-pressure" (hints) to the PartyProcessor?
  return createWritable<IEchoStream>(async (message: IEchoStream) => {
    log('Demuxer.write:', JSON.stringify(message));
    const { data: { itemId, genesis } } = message;
    assert(itemId);

    if (genesis) {
      const { itemType, modelType } = genesis;
      assert(itemType && modelType);

      const itemStream = createReadable();
      itemStreams.set(itemId, itemStream);
      const item = await itemManager.constructItem(itemId, itemType, modelType, itemStream);
      assert(item.id === itemId);
    } else {
      const itemStream = itemStreams.get(itemId);
      assert(itemStream, `Missing item: ${itemId}`);
      await itemStream.push(message);
    }
  });
};
