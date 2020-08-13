//
// Copyright 2020 DXOS.org
//

import Chance from 'chance';
import hypercore from 'hypercore';
import pify from 'pify';
import ram from 'random-access-memory';
import { Writable } from 'stream';
import tempy from 'tempy';

import { Codec } from '@dxos/codec-protobuf';
import { createId, keyToString } from '@dxos/crypto';
import { FeedStore } from '@dxos/feed-store';

import { latch, sink } from '../../src/util';
import { createWritableFeedStream, HypercoreBlock } from './feed';
import { createTestMessage } from '../../src/testing';

import { dxos } from '../../src/proto/gen/testing';
import TestingSchema from '../../src/proto/gen/testing.json';

const chance = new Chance();

const codec = new Codec('dxos.echo.testing.FeedEnvelope')
  .addJson(TestingSchema)
  .build();

//
// Streams: https://devhints.io/nodejs-stream
//

describe('Stream tests', () => {
  /**
   * Basic proto envelope encoding.
   */
  test('proto encoding', () => {
    const buffer = codec.encode({
      payload: {
        __type_url: 'dxos.echo.testing.TestItemMutation',
        value: 'message-1'
      }
    });

    const { payload: { value } } = codec.decode(buffer);
    expect(value).toBe('message-1');
  });

  /**
   * Basic hypercore (feed) encoding.
   */
  test('hypercore encoding', async () => {
    const feed = hypercore(ram, { valueEncoding: codec });

    await pify(feed.append.bind(feed))({
      payload: {
        __type_url: 'dxos.echo.testing.TestItemMutation',
        value: 'message-1'
      }
    });

    const { payload: { value } } = await pify(feed.get.bind(feed))(0);
    expect(value).toBe('message-1');
  });

  /**
   * FeedStore Streams with encoding.
   */
  test('message streams', async () => {
    const config = {
      numFeeds: 5,
      numBlocks: 100
    };

    const feedStore = new FeedStore(ram, { feedOptions: { valueEncoding: codec } });
    await feedStore.open();

    // Create feeds.
    for (let i = 0; i < config.numFeeds; i++) {
      await feedStore.openFeed(`feed-${i}`);
    }

    const descriptors = feedStore.getDescriptors();
    expect(descriptors).toHaveLength(config.numFeeds);

    // Create messages.
    const count = new Map();
    for (let i = 0; i < config.numBlocks; i++) {
      const { path, feed } = chance.pickone(descriptors);
      count.set(path, (count.get(path) ?? 0) + 1);
      await feed.append({
        payload: {
          __type_url: 'dxos.echo.testing.TestItemMutation',
          value: createId()
        }
      });
    }

    // Test stream.
    const ids = new Set();
    const stream = feedStore.createReadStream({ live: true });
    stream.on('data', (block: HypercoreBlock<dxos.echo.testing.IFeedEnvelope>) => {
      const { data: { payload } } = block;
      const { value } = (payload as unknown as dxos.echo.testing.ITestItemMutation);
      ids.add(value);
    });

    await sink(stream, 'data', config.numBlocks);

    expect(ids.size).toBe(config.numBlocks);
    for (const descriptor of descriptors) {
      const { path, feed } = descriptor;
      expect(feed.length).toBe(count.get(path));
    }

    feedStore.close();
  });

  /* eslint-disable no-lone-blocks */
  test('Feed opening and closing', async () => {
    const directory = tempy.directory();

    let feedKey;

    {
      const feedStore = new FeedStore(directory, { feedOptions: { valueEncoding: codec } });
      await feedStore.open();

      const feed = await feedStore.openFeed('test-feed');
      feedKey = feed.key;

      await pify(feed.append.bind(feed))({
        payload: {
          __type_url: 'dxos.echo.testing.TestItemMutation',
          value: createId()
        }
      });

      await feedStore.close();
    }

    {
      const feedStore = new FeedStore(directory, { feedOptions: { valueEncoding: codec } });
      await feedStore.open();

      const feed = await feedStore.openFeed('test-feed');
      expect(keyToString(feedKey)).toBe(keyToString(feed.key));

      const readable = feedStore.createReadStream({ live: true });
      await sink(readable, 'data', 1);

      await feedStore.close();
    }
  });

  test('feed streams', async () => {
    const feedStore = new FeedStore(ram, { feedOptions: { valueEncoding: codec } });
    await feedStore.initialize();

    const feed = await feedStore.openFeed('test-feed');
    const inputStream = feedStore.createReadStream({ live: true, feedStoreInfo: true });

    const count = 5;
    const [counter, updateCounter] = latch(5);
    inputStream.pipe(new Writable({
      objectMode: true,
      write (message, _, callback) {
        const { data: { payload: { value } } } = message;
        expect(value).toBeTruthy();
        updateCounter();
        callback();
      }
    }));

    const outputStream = createWritableFeedStream(feed);
    for (let i = 0; i < count; i++) {
      outputStream.write(createTestMessage(i + 1));
    }

    await counter;
  });
});
