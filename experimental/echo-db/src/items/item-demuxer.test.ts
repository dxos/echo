//
// Copyright 2020 DXOS.org
//

import debug from 'debug';

import { createId, createKeyPair } from '@dxos/crypto';

import { dxos } from '../../../echo-protocol/src/proto/gen/testing';

import { ModelFactory } from '../../../model-factory/src';
import { TestModel } from '../testing';
import { createTransform, latch } from '../../../util/src';
import { Item } from './item';
import { createItemDemuxer } from './item-demuxer';
import { ItemManager } from './item-manager';
import { IEchoStream } from './types';

const log = debug('dxos:echo:item-demuxer:test');
debug.enable('dxos:echo:*');

describe('item demxuer', () => {
  test('set-up', async () => {
    const { publicKey: feedKey } = createKeyPair();

    const modelFactory = new ModelFactory()
      .registerModel(TestModel.type, TestModel);

    const writable = createTransform<dxos.echo.IEchoEnvelope, IEchoStream>(
      async (message: dxos.echo.IEchoEnvelope) => {
        const response: IEchoStream = {
          meta: {
            feedKey,
            seq: 0
          },
          data: message
        };

        return response;
      });

    const itemManager = new ItemManager(modelFactory, writable);
    const itemDemuxer = createItemDemuxer(itemManager);

    // TODO(burdon): Pipe writable output back into partyStream.
    writable.pipe(itemDemuxer);

    const itemId = createId();

    // Query for items.
    const [updatedItems, onUpdateItem] = latch();
    const items = await itemManager.queryItems();
    const unsubscribe = items.subscribe((items: Item<any>[]) => {
      expect(items).toHaveLength(1);
      onUpdateItem();
    });

    const message: dxos.echo.IEchoEnvelope = {
      itemId,
      genesis: {
        itemType: 'wrn://dxos.org/item/test',
        modelType: TestModel.type
      }
    };
    await writable.write(message);

    // Wait for mutations to be processed.
    await updatedItems;

    // Update item (causes mutation to be propagated).
    const item = itemManager.getItem(itemId);
    expect(item).toBeTruthy();
    const model: TestModel = item?.model as TestModel;
    await model.setProperty('title', 'Hello');

    const [updated, onUpdate] = latch();
    model.subscribe(model => {
      expect((model as TestModel).keys.length).toBe(1);
      onUpdate();
    });

    // TODO(burdon): Should trigger itemManager update also.
    // Wait for model mutation to propagate.
    await updated;

    log('Properties', model.keys);
    expect(model.keys.length).toBe(1);
    unsubscribe();
  });
});
