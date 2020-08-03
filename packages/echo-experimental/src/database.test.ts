//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import Chance from 'chance';
import debug from 'debug';
import ram from 'random-access-memory';

import { sleep } from '@dxos/async';
import { FeedStore } from '@dxos/feed-store';
import { Codec } from '@dxos/codec-protobuf';

import { createItemDemuxer, ItemManager, Model, ModelMessage, ModelFactory } from './database';
import { latch } from './util';

import TestingSchema from './proto/gen/testing.json';

const log = debug('dxos:echo:testing');
debug.enable('dxos:echo:*');

const codec = new Codec('dxos.echo.testing.Envelope')
  .addJson(TestingSchema)
  .build();

const chance = new Chance();

/**
 * Test model.
 */
// TODO(burdon): Replace with echo ObjectModel.
class TestModel extends Model {
  // TODO(burdon): Format?
  static type = 'wrn://dxos.io/model/test';

  _values = new Map();

  get keys () {
    return Array.from(this._values.keys());
  }

  getValue (key: string) {
    return this._values.get(key);
  }

  async processMessage (message: ModelMessage) {
    const { data: { key, value } } = message;
    await sleep(50);
    this._values.set(key, value);
  }

  async setProperty (key: string, value: string) {
    // TODO(burdon): Create wrapper for ItemMutation that includes the itemId.
    await this.write({
      __type_url: 'dxos.echo.testing.TestItemMutation',
      itemId: this.itemId,
      key,
      value
    });
  }
}

test('streaming', async () => {
  const config = {
    numFeeds: 5,
    numMessages: 5
  };

  const feedStore = new FeedStore(ram, { feedOptions: { valueEncoding: codec } });

  const modelFactory = new ModelFactory().registerModel(TestModel.type, TestModel);

  //
  // Generate items.
  //
  {
    // TODO(burdon): Replace with stream from Party demuxer.
    await feedStore.open();
    const readable = feedStore.createReadStream({ live: true });

    // Create cloned feeds (including ours).
    for (let i = 0; i < config.numFeeds; i++) {
      await feedStore.openFeed(`feed-${i}`);
    }

    const descriptors = feedStore.getDescriptors();
    expect(descriptors).toHaveLength(config.numFeeds);

    // Pick feed to belong to current node.
    const { feed } = chance.pickone(descriptors);
    // TODO(burdon): Replace feed with Writeable stream from PartyManager.
    const itemManager = new ItemManager(modelFactory, feed);

    // NOTE: This will be the Party's readable stream.
    readable.pipe(createItemDemuxer(itemManager));

    // TODO(burdon): Must not create using own readable stream!
    const item = await itemManager.createItem(TestModel.type);

    // TODO(burdon): Randomly create or mutate items.
    for (let i = 0; i < config.numMessages; i++) {
      // @ts-ignore TODO(burdon): Cast.
      item.model.setProperty('title', `value-${i}`);
    }

    const [promise, callback] = latch(config.numMessages);
    item.model.on('update', callback);
    expect(await promise).toBe(config.numMessages);

    // TODO(burdon): Test item and model.
    expect(itemManager.getItem(item.id));
  }

  //
  // Replay items.
  //
  {
    await feedStore.open();
    const readable = feedStore.createReadStream({ live: true });

    const descriptors = feedStore.getDescriptors();
    expect(descriptors).toHaveLength(config.numFeeds);

    const { feed } = chance.pickone(descriptors);
    const itemManager = new ItemManager(modelFactory, feed);
  }
});
