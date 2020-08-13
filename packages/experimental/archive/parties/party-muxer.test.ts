//
// Copyright 2020 DXOS.org
//

import Chance from 'chance';
import debug from 'debug';
import ram from 'random-access-memory';
import tempy from 'tempy';

import { FeedStore } from '@dxos/feed-store';
import { Codec } from '@dxos/codec-protobuf';
import { createId, randomBytes } from '@dxos/crypto';
import { sleep } from '@dxos/async';

import { LogicalClockStamp, createTimestampTransforms } from '../clock';
import { ItemManager, createItemDemuxer } from '../items';
import { ModelFactory } from '../../src/models';
import {
  TestModel, createPartyAdmit, createItemGenesis, createTestItemMutation, createTestMessageWithTimestamp
} from '../../src/testing';
import { sink } from '../../src/util';
import { createPartyMuxer } from './index';
import { collect, createWritableFeedStream } from '../pipeline';

import TestingSchema from '../../src/proto/gen/testing.json';

const log = debug('dxos:echo:testing');
debug.enable('dxos:echo:*');

const codec = new Codec('dxos.echo.testing.FeedEnvelope')
  .addJson(TestingSchema)
  .build();

const chance = new Chance();

const ItemType = 'test-item';

/* eslint-disable no-lone-blocks */
describe('database', () => {
  test.skip('item construction', async () => {
    const modelFactory = new ModelFactory()
      .registerModel(TestModel.type, TestModel);

    const feedStore = new FeedStore(ram, { feedOptions: { valueEncoding: codec } });
    await feedStore.open();
    const feed = await feedStore.openFeed('test-feed');

    // TODO(burdon): NOTE: Stream from readable is different from expected FeedMessage.
    const readable = feedStore.createReadStream({ live: true, feedStoreInfo: true });
    const itemManager = new ItemManager(modelFactory, createWritableFeedStream(feed));
    readable.pipe(createItemDemuxer(itemManager));

    const item = await itemManager.createItem(ItemType, TestModel.type);
    await (item.model as TestModel).setProperty('title', 'Hello');

    const items = itemManager.getItems();
    expect(items).toHaveLength(1);
    (items[0].model as TestModel).on('update', (model: TestModel) => {
      expect(model.value).toEqual({ title: 'Hello' });
    });
  });

  test.skip('streaming', async () => {
    const config = {
      numFeeds: 1,
      maxItems: 1,
      numMutations: 5
    };

    const modelFactory = new ModelFactory().registerModel(TestModel.type, TestModel);

    const count = {
      items: 0,
      mutations: 0
    };

    // Temp store for feeds.
    const directory = tempy.directory();

    //
    // Generate items.
    //
    {
      const feedStore = new FeedStore(directory, { feedOptions: { valueEncoding: codec } });
      await feedStore.open();

      const feed = await feedStore.openFeed(ItemType);
      const readable = feedStore.createReadStream({ live: true });
      const counter = sink(feed, 'append', config.numMutations);

      const itemManager = new ItemManager(modelFactory, createWritableFeedStream(feed));
      readable.pipe(createItemDemuxer(itemManager));

      // Randomly create or mutate items.
      for (let i = 0; i < config.numMutations; i++) {
        if (count.items === 0 || (count.items < config.maxItems && Math.random() < 0.5)) {
          const item = await itemManager.createItem(ItemType, TestModel.type);
          log('Created Item:', item.id);
          count.items++;
        } else {
          const item = chance.pickone(itemManager.getItems());
          log('Mutating Item:', item.id);
          await item.model.setProperty(chance.pickone(['a', 'b', 'c']), `value-${i}`);
          count.mutations++;
        }
      }

      await counter;
      await feedStore.close();
    }

    log('Config:', config);
    log('Count:', count);

    //
    // Replay items.
    //
    {
      const feedStore = new FeedStore(directory, { feedOptions: { valueEncoding: codec } });
      await feedStore.open();

      const descriptors = feedStore.getDescriptors();
      expect(descriptors).toHaveLength(config.numFeeds);
      const descriptor = chance.pickone(descriptors);
      const feed = await descriptor.open();

      const itemManager = new ItemManager(modelFactory, createWritableFeedStream(feed));

      const created = sink(itemManager, 'create', count.items);
      const updated = sink(itemManager, 'update', count.mutations);

      const readable = feedStore.createReadStream({ live: true });
      readable.pipe(createItemDemuxer(itemManager));

      // Wait for mutations to be processed.
      await created;
      await updated;

      // TODO(burdon): Test items have same state.
      const items = itemManager.getItems();
      for (const item of items) {
        log((item.model as TestModel).value);
      }

      await feedStore.close();
    }
  });

  test.skip('timestamp writer', () => {
    const ownFeed = randomBytes();

    const feed1Key = randomBytes();
    const feed2Key = randomBytes();

    const [inboundTransfrom, outboundTransfrom] = createTimestampTransforms(ownFeed);
    const writtenMessages = collect(outboundTransfrom);

    // current timestamp = {}
    outboundTransfrom.write({ payload: { __type_url: 'dxos.echo.testing.ItemEnvelope' } });
    // current timestamp = { F1: 1 }
    inboundTransfrom.write(createTestMessageWithTimestamp(feed1Key, new LogicalClockStamp(), 1));
    // current timestamp = { F1: 1 }
    outboundTransfrom.write({ payload: { __type_url: 'dxos.echo.testing.ItemEnvelope' } });
    // current timestamp = { F1: 2 }
    inboundTransfrom.write(createTestMessageWithTimestamp(feed1Key, new LogicalClockStamp(), 2));
    // current timestamp = { F1: 2 }
    outboundTransfrom.write({ payload: { __type_url: 'dxos.echo.testing.ItemEnvelope' } });
    // current timestamp = { F1: 3, F2: 1 }
    inboundTransfrom.write(createTestMessageWithTimestamp(feed1Key, new LogicalClockStamp([[feed2Key, 1]]), 3));
    // current timestamp = { F1: 3, F2: 1 }
    outboundTransfrom.write({ payload: { __type_url: 'dxos.echo.testing.ItemEnvelope' } });
    // current timestamp = { F1: 3, F2: 1 }
    inboundTransfrom.write(createTestMessageWithTimestamp(feed2Key, new LogicalClockStamp(), 1));
    // current timestamp = { F1: 3, F2: 1 }
    outboundTransfrom.write({ payload: { __type_url: 'dxos.echo.testing.ItemEnvelope' } });

    // TODO(burdon): Just test timestamp.
    expect(writtenMessages).toEqual([
      { payload: { __type_url: 'dxos.echo.testing.ItemEnvelope', timestamp: LogicalClockStamp.encode(LogicalClockStamp.zero()) } },
      { payload: { __type_url: 'dxos.echo.testing.ItemEnvelope', timestamp: LogicalClockStamp.encode(new LogicalClockStamp([[feed1Key, 1]])) } },
      { payload: { __type_url: 'dxos.echo.testing.ItemEnvelope', timestamp: LogicalClockStamp.encode(new LogicalClockStamp([[feed1Key, 2]])) } },
      { payload: { __type_url: 'dxos.echo.testing.ItemEnvelope', timestamp: LogicalClockStamp.encode(new LogicalClockStamp([[feed1Key, 3], [feed2Key, 1]])) } },
      { payload: { __type_url: 'dxos.echo.testing.ItemEnvelope', timestamp: LogicalClockStamp.encode(new LogicalClockStamp([[feed1Key, 3], [feed2Key, 1]])) } }
    ]);
  });

  test.skip('parties', async () => {
    const modelFactory = new ModelFactory().registerModel(TestModel.type, TestModel);

    const feedStore = new FeedStore(ram, { feedOptions: { valueEncoding: codec } });
    await feedStore.open();

    const feeds = [
      await feedStore.openFeed('feed-1'),
      await feedStore.openFeed('feed-2'),
      await feedStore.openFeed('feed-3')
    ];

    const descriptors = [
      feedStore.getOpenFeed((descriptor: any) => descriptor.path === 'feed-1'),
      feedStore.getOpenFeed((descriptor: any) => descriptor.path === 'feed-2'),
      feedStore.getOpenFeed((descriptor: any) => descriptor.path === 'feed-3')
    ];

    const set = new Set<Uint8Array>();
    set.add(descriptors[0].feedKey);

    const streams = [
      createWritableFeedStream(feeds[0]),
      createWritableFeedStream(feeds[1]),
      createWritableFeedStream(feeds[2])
    ];

    const itemIds = [
      createId()
    ];

    const [inboundTransfrom, outboundTransform] = createTimestampTransforms(descriptors[0].key);
    const itemManager = new ItemManager(modelFactory, outboundTransform.pipe(streams[0]));

    // Set-up pipeline.
    // TODO(burdon): Test closing pipeline.
    const partyMuxer = createPartyMuxer(feedStore, [descriptors[0].key]);
    const itemDemuxer = createItemDemuxer(itemManager);
    partyMuxer.pipe(inboundTransfrom).pipe(itemDemuxer);

    {
      streams[0].write(createItemGenesis(itemIds[0], ItemType));
      streams[0].write(createTestItemMutation(itemIds[0], 'title', 'Value-1'));
      streams[1].write(createTestItemMutation(itemIds[0], 'title', 'Value-2')); // Hold.

      await sink(itemManager, 'create', 1);
      await sink(itemManager, 'update', 1);

      const items = itemManager.getItems();
      expect(items).toHaveLength(1);
      expect((items[0].model as TestModel).getValue('title')).toEqual('Value-1');
    }

    {
      streams[0].write(createTestItemMutation(itemIds[0], 'title', 'Value-3'));

      await sink(itemManager, 'update', 1);

      const items = itemManager.getItems();
      expect(items).toHaveLength(1);
      expect((items[0].model as TestModel).getValue('title')).toEqual('Value-3');
    }

    {
      streams[0].write(createPartyAdmit(descriptors[1].key));

      await sink(itemManager, 'update', 1);

      const items = itemManager.getItems();
      expect(items).toHaveLength(1);
      expect((items[0].model as TestModel).getValue('title')).toEqual('Value-2');
    }
  });

  test.skip('ordering', async () => {
    const modelFactory = new ModelFactory().registerModel(TestModel.type, TestModel);

    const feedStore = new FeedStore(ram, { feedOptions: { valueEncoding: codec } });
    await feedStore.open();

    const feeds = [
      await feedStore.openFeed('feed-1'),
      await feedStore.openFeed('feed-2')
    ];

    const descriptors = [
      feedStore.getOpenFeed((descriptor: any) => descriptor.path === 'feed-1'),
      feedStore.getOpenFeed((descriptor: any) => descriptor.path === 'feed-2')
    ];

    const set = new Set<Uint8Array>();
    set.add(descriptors[0].feedKey);

    const streams = [
      createWritableFeedStream(feeds[0]),
      createWritableFeedStream(feeds[1])
    ];

    const itemIds = [
      createId(),
      createId()
    ];

    const [inboundTransfrom, outboundTransform] = createTimestampTransforms(descriptors[0].key);
    const itemManager = new ItemManager(modelFactory, outboundTransform.pipe(streams[0]));

    // Set-up pipeline.
    // TODO(burdon): Test closing pipeline.
    const partyMuxer = createPartyMuxer(feedStore, [descriptors[0].key, descriptors[1].key]);
    const itemDemuxer = createItemDemuxer(itemManager);
    partyMuxer.pipe(inboundTransfrom).pipe(itemDemuxer);

    {
      const timestamp = new LogicalClockStamp([[descriptors[1].key, 1]]); // require feed 2 to have 2 messages
      streams[0].write(createItemGenesis(itemIds[0], ItemType, timestamp));
      streams[0].write(createTestItemMutation(itemIds[0], 'title', 'Value-1', timestamp));

      await sleep(10); // TODO(marik-d): Is threre a better way to do this?

      const items = itemManager.getItems();
      expect(items).toHaveLength(0);
    }

    {
      streams[1].write(createItemGenesis(itemIds[1], ItemType));
      streams[1].write(createTestItemMutation(itemIds[1], 'title', 'Value-1'));

      await sink(itemManager, 'create', 2);
      await sink(itemManager, 'update', 2);

      const items = itemManager.getItems();
      expect(items).toHaveLength(2);
    }
  });
});
