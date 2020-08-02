//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
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
  ];
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
  const modelFactory = new ModelFactory().registerModel(TestModel.type, TestModel);

  const feedStore = new FeedStore(ram, { feedOptions: { valueEncoding: codec } });
  await feedStore.open();

  const readable = feedStore.createReadStream({ live: true });

  // TODO(burdon): Write to multiple feeds.
  const feed = await feedStore.openFeed('test-1');

  const count = 3;
  for (let i = 0; i < count; i++) {
    await feed.append({
      message: {
        __type_url: 'dxos.echo.testing.TestMessage',
        seq: i,
        id: createId()
      }
    });
  }

  const model = modelFactory.createModel(TestModel.type, readable);

  const [promise, callback] = latch(count);
  model.on('update', callback);
  expect(await promise).toBe(count);
});
