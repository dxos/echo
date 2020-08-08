//
// Copyright 2020 DXOS.org
//

import ram from 'random-access-memory';
import waitForExpect from 'wait-for-expect';
import assert from 'assert';

import { keyToString } from '@dxos/crypto';
import { FeedStore } from '@dxos/feed-store';
import { Codec } from '@dxos/codec-protobuf';

import { createWritableFeedStream } from './database';
import { FeedStoreIterator } from './feed-store-iterator';
import { assumeType, latch } from './util';
import { createAdmit, createRemove, createMessage } from './testing';

import TestingSchema from './proto/gen/testing.json';
import { dxos } from './proto/gen/testing';

const codec = new Codec('dxos.echo.testing.Envelope')
  .addJson(TestingSchema)
  .build();

const setup = async (paths: string[]) => {
  const feedStore = new FeedStore(ram, { feedOptions: { valueEncoding: codec } });
  await feedStore.open();

  const feeds = await Promise.all(paths.map(path => feedStore.openFeed(path)));
  const descriptors = feeds.map(feed => feedStore.getDescriptors().find(descriptor => descriptor.feed === feed)!);
  const streams = feeds.map(feed => createWritableFeedStream(feed));

  return { feedStore, feeds, descriptors, streams };
};

/* eslint-disable no-lone-blocks */
describe('FeedStoreIterator', () => {
  test('single feed', async () => {
    const { feedStore, streams } = await setup(['feed']);

    streams[0].write(createMessage(1));
    streams[0].write(createMessage(2));
    streams[0].write(createMessage(3));

    const iterator = await FeedStoreIterator.create(feedStore, async () => true);

    const messages = [];
    for await (const msg of iterator) {
      messages.push(msg);
      if (messages.length === 3) {
        break;
      }
    }

    expect(messages).toEqual([
      { data: createMessage(1) },
      { data: createMessage(2) },
      { data: createMessage(3) }
    ]);
  });

  test('one allowed feed & one locked', async () => {
    const { feedStore, streams, descriptors } = await setup(['feed-1', 'feed-2']);

    streams[0].write(createMessage(1));
    streams[1].write(createMessage(2));
    streams[0].write(createMessage(3));

    const iterator = await FeedStoreIterator.create(feedStore, async feedKey => feedKey === descriptors[0].key);

    const messages = [];
    for await (const msg of iterator) {
      messages.push(msg);
      if (messages.length === 2) { break; }
    }

    expect(messages).toEqual([
      { data: createMessage(1) },
      { data: createMessage(3) }
    ]);
  });

  test('feed added while iterating', async () => {
    const feedStore = new FeedStore(ram, { feedOptions: { valueEncoding: codec } });
    await feedStore.open();

    const iterator = await FeedStoreIterator.create(feedStore, async () => true);

    const feed = await feedStore.openFeed('feed');
    const stream = createWritableFeedStream(feed);

    const [count, incCount] = latch(3);
    const messages: any[] = [];
    setImmediate(async () => {
      for await (const msg of iterator) {
        messages.push(msg);
        incCount();
      }
    });

    stream.write(createMessage(1));
    stream.write(createMessage(2));
    stream.write(createMessage(3));
    await count;

    // TODO(burdon): Use instead of waitForExpect.
    expect(messages).toEqual([
      { data: createMessage(1) },
      { data: createMessage(2) },
      { data: createMessage(3) }
    ]);
  });

  test('dynamically authorizing other feeds', async () => {
    const { feedStore, streams, descriptors } = await setup(['feed-1', 'feed-2']);

    const authenticatedFeeds = new Set<string>([keyToString(descriptors[0].key)]);
    const iterator = await FeedStoreIterator.create(feedStore, async feedKey => {
      return authenticatedFeeds.has(keyToString(feedKey));
    });

    const messages: any[] = [];
    setImmediate(async () => {
      for await (const msg of iterator) {
        messages.push(msg);

        switch (msg.data.message.__type_url) {
          // TODO(burdon): Convert to mutation.
          case 'dxos.echo.testing.TestData':
            break;

          case 'dxos.echo.testing.Admit': {
            assumeType<dxos.echo.testing.IAdmit>(msg.data.message);
            const { feedKey } = msg.data.message;
            assert(feedKey);
            authenticatedFeeds.add(keyToString(feedKey));
            break;
          }

          case 'dxos.echo.testing.Remove': {
            assumeType<dxos.echo.testing.IRemove>(msg.data.message);
            const { feedKey } = msg.data.message;
            assert(feedKey);
            assert(authenticatedFeeds.has(keyToString(feedKey)));
            authenticatedFeeds.delete(keyToString(feedKey));
            break;
          }

          default:
            throw new Error(`Unexpected message type: ${msg.data.message.__type_url}`);
        }
      }
    });

    // TODO(burdon): Adapt latch pattern to wait for n messages to be processed.

    // Expect non-admitted messages to be held.
    {
      streams[0].write(createMessage(1));
      streams[1].write(createMessage(2)); // Should be held.
      streams[0].write(createMessage(3));

      await waitForExpect(() => expect(messages).toEqual([
        { data: createMessage(1) },
        { data: createMessage(3) }
      ]));
    }

    // Release held message by admitting feed.
    {
      streams[0].write(createAdmit(descriptors[1].key));

      await waitForExpect(() => expect(messages).toEqual([
        { data: createMessage(1) },
        { data: createMessage(3) },
        { data: createAdmit(descriptors[1].key) },
        { data: createMessage(2) } // Now released.
      ]));
    }

    // Remove feed and test subsequent messages are held.
    {
      streams[1].write(createRemove(descriptors[0].key));
      await waitForExpect(() => expect(messages.length).toEqual(5));

      streams[0].write(createMessage(4)); // Should be held.
      streams[1].write(createMessage(5));

      await waitForExpect(() => expect(messages).toEqual([
        { data: createMessage(1) },
        { data: createMessage(3) },
        { data: createAdmit(descriptors[1].key) },
        { data: createMessage(2) },
        { data: createRemove(descriptors[0].key) },
        { data: createMessage(5) }
      ]));
    }
  });
});
