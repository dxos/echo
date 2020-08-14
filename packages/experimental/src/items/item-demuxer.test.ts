//
// Copyright 2020 DXOS.org
//

import debug from 'debug';

import { sleep } from '@dxos/async';
import { createId } from '@dxos/crypto';

import { dxos } from '../proto/gen/testing';

import { ModelFactory } from '../models';
import { TestModel } from '../testing';
import { createReadable, createWritable, latch } from '../util';
import { createItemDemuxer } from './item-demuxer';
import { ItemManager } from './item-manager';

const log = debug('dxos:echo:item');
debug.enable('dxos:echo:*');

describe('item demxuer', () => {
  test('set-up', async () => {
    const modelFactory = new ModelFactory()
      .registerModel(TestModel.type, TestModel);

    const [count, updateCount] = latch(1);
    const writable = createWritable<dxos.echo.testing.IEchoEnvelope>(async (message: dxos.echo.testing.IEchoEnvelope) => {
      log(message);
      updateCount();
    });

    const itemManager = new ItemManager(modelFactory, writable);
    const itemDemuxer = createItemDemuxer(itemManager);

    // Query for items.
    const items = await itemManager.queryItems();
    const unsubscribe = items.subscribe(() => {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    });

    // TODO(burdon): Pipe writable output back into partyStream.
    const partyStream = createReadable();
    partyStream.pipe(itemDemuxer);

    // TODO(burdon): Create generic wrapper (for IEchoStream object).
    const itemId = createId();
    await partyStream.push({
      data: {
        itemId,
        genesis: {
          itemType: 'wrn://dxos.org/item/test',
          modelType: TestModel.type
        }
      }
    });

    // TODO(burdon): Wait for event.
    await sleep(100);

    // Update item (causes mutation to be propagated).
    const item = itemManager.getItem(itemId);
    expect(item).toBeTruthy();
    const model: TestModel = item?.model as TestModel;
    await model.setProperty('title', 'DXOS');

    await count;

    // TODO(burdon): Wait for processing (event on item, which should update query).
    console.log(model.properties);
    unsubscribe();
  });
});
