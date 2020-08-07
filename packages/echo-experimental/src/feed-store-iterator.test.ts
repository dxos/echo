//
// Copyright 2020 DXOS.org
//

import ram from 'random-access-memory';
import waitForExpect from 'wait-for-expect';

import { FeedStore } from '@dxos/feed-store';

import { createWritableFeedStream } from './database';
import { FeedStoreIterator } from './feed-store-iterator';

const setup = async (feedNames: string[]) => {
  // TODO(burdon): Deleting all tests that do not use protocol buffers!
  const feedStore = new FeedStore(ram, { feedOptions: { valueEncoding: 'json' } });
  await feedStore.open();

  const feeds = await Promise.all(feedNames.map(name => feedStore.openFeed(name)));
  const descriptors = feeds.map(feed => feedStore.getDescriptors().find(descriptor => descriptor.feed === feed)!);
  const streams = feeds.map(feed => createWritableFeedStream(feed));
  return { feedStore, feeds, descriptors, streams };
};

describe('FeedStoreIterator', () => {
  test('fake', () => {
    expect(true).toBeTruthy();
  });

  test.skip('single feed', async () => {
    const { feedStore, streams } = await setup(['feed']);

    streams[0].write({ data: 1 });
    streams[0].write({ data: 2 });
    streams[0].write({ data: 3 });

    const iterator = await FeedStoreIterator.create(feedStore, async () => true);

    const messages = [];
    for await (const msg of iterator) {
      messages.push(msg);
      if (messages.length === 3) { break; }
    }

    expect(messages).toEqual([
      { data: 1 },
      { data: 2 },
      { data: 3 }
    ]);
  });

  test.skip('one allowed feed & one locked', async () => {
    const { feedStore, streams, descriptors } = await setup(['feed-1', 'feed-2']);

    streams[0].write({ data: 1 });
    streams[1].write({ data: 2 });
    streams[0].write({ data: 3 });

    const iterator = await FeedStoreIterator.create(feedStore, async feedKey => feedKey.equals(descriptors[0].key));

    const messages = [];
    for await (const msg of iterator) {
      messages.push(msg);
      if (messages.length === 2) { break; }
    }

    expect(messages).toEqual([
      { data: 1 },
      { data: 3 }
    ]);
  });

  /*
  test.skip('dynamically authorizing other feeds', async () => {
    const { feedStore, streams, descriptors } = await setup(['feed-1', 'feed-2']);

    streams[0].write({ data: 1 });
    streams[1].write({ data: 2 });
    streams[0].write({ data: 3 });

    const authenticatedFeeds = new Set([descriptors[0].key.toString('hex')]);
    const iterator = await FeedStoreIterator.create(feedStore, async feedKey => authenticatedFeeds.has(feedKey.toString('hex')));

    const messages: any[] = [];
    setImmediate(async () => {
      for await (const msg of iterator) {
        messages.push(msg);
        if (msg.auth) {
          authenticatedFeeds.add(msg.auth);
        }
        if (msg.remove) {
          authenticatedFeeds.delete(msg.remove);
        }
      }
    });

    await waitForExpect(() => expect(messages).toEqual([
      { data: 1 },
      { data: 3 }
    ]));

    streams[0].write({ auth: descriptors[1].key.toString('hex') });

    await waitForExpect(() => expect(messages).toEqual([
      { data: 1 },
      { data: 3 },
      { auth: descriptors[1].key.toString('hex') },
      { data: 2 }
    ]));

    streams[1].write({ remove: descriptors[0].key.toString('hex') });
    await waitForExpect(() => expect(messages.length).toEqual(5));
    streams[0].write({ data: 4 });
    streams[1].write({ data: 5 });

    await waitForExpect(() => expect(messages).toEqual([
      { data: 1 },
      { data: 3 },
      { auth: descriptors[1].key.toString('hex') },
      { data: 2 },
      { remove: descriptors[0].key.toString('hex') },
      { data: 5 }
    ]));
  });
  */

  test.skip('feed added while iterating', async () => {
    const feedStore = new FeedStore(ram, { feedOptions: { valueEncoding: 'json' } });
    await feedStore.open();

    const iterator = await FeedStoreIterator.create(feedStore, async () => true);

    const feed = await feedStore.openFeed('feed');
    const stream = createWritableFeedStream(feed);

    const messages: any[] = [];
    setImmediate(async () => {
      for await (const msg of iterator) {
        messages.push(msg);
      }
    });

    stream.write({ data: 1 });
    stream.write({ data: 2 });
    stream.write({ data: 3 });

    await waitForExpect(() => expect(messages).toEqual([
      { data: 1 },
      { data: 2 },
      { data: 3 }
    ]));
  });
});
