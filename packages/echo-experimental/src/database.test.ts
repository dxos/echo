//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import Chance from 'chance';
import debug from 'debug';
import ram from 'random-access-memory';

import { sleep } from '@dxos/async';
import { createId } from '@dxos/crypto';
import { FeedStore } from '@dxos/feed-store';
import { Codec } from '@dxos/codec-protobuf';

import { Model, ModelFactory } from './database';

import TestingSchema from './proto/gen/testing.json';

const log = debug('dxos:echo:testing');
debug.enable('dxos:echo:*');

const codec = new Codec('dxos.echo.testing.Envelope')
  .addJson(TestingSchema)
  .build();

const chance = new Chance();

// TODO(burdon): Factor out to @dxos/async. (also remove useValue).
const latch = (n: number) => {
  assert(n > 0);

  let callback: Function;
  const promise = new Promise((resolve) => {
    callback = (value: number) => resolve(value);
  });

  let count = 0;
  return [
    promise,
    () => {
      if (++count === n) {
        callback(count);
      }
    }
  ] as const;
};

class TestModel extends Model {
  // TODO(burdon): Format?
  static type = 'wrn://dxos.io/model/test';

  async processMessage (data: any) {
    const { message } = data;
    await sleep(50);
    log(JSON.stringify(message));
  }
}

test('streaming', async () => {
  const config = {
    numFeeds: 5,
    numMessages: 30
  };

  const feedStore = new FeedStore(ram, { feedOptions: { valueEncoding: codec } });

  const modelFactory = new ModelFactory().registerModel(TestModel.type, TestModel);

  // Generate items.
  {
    await feedStore.open();

    for (let i = 0; i < config.numFeeds; i++) {
      await feedStore.openFeed(`feed-${i}`);
    }

    const descriptors = feedStore.getDescriptors();
    expect(descriptors).toHaveLength(config.numFeeds);

    const readable = feedStore.createReadStream({ live: true });

    // TODO(burdon): Demux stream to create and dispatch to items.
    // const itemManager = new ItemManager(modelFactory, feed.createWriteStream());
    // readable.pipe(createItemDemuxer(itemManager));
    const model = modelFactory.createModel(TestModel.type, readable);
    assert(model)

    for (let i = 0; i < config.numMessages; i++) {
      // TODO(burdon): Randomly create or mutate items.
      // TODO(burdon): Perform item mutation via the associated model.
      const { feed } = chance.pickone(descriptors);
      await feed.append({
        message: {
          __type_url: 'dxos.echo.testing.TestItemMutation',
          itemId: createId(),
          seq: i,
          id: createId()
        }
      });
    }

    const [promise, callback] = latch(config.numMessages);
    model.on('update', callback);
    expect(await promise).toBe(config.numMessages);
  }

  // Replay items.
  {
    await feedStore.open();
    const readable = feedStore.createReadStream({ live: true });

    const model = modelFactory.createModel(TestModel.type, readable);
    assert(model)

    const [promise, callback] = latch(config.numMessages);
    model.on('update', callback);
    expect(await promise).toBe(config.numMessages);
  }
});
