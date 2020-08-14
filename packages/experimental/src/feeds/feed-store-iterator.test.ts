//
// Copyright 2020 DXOS.org
//

import Chance from 'chance';
import debug from 'debug';
import ram from 'random-access-memory';

import { createId, humanize } from '@dxos/crypto';
import { FeedStore } from '@dxos/feed-store';

import { codec, jsonReplacer } from '../proto';
import { FeedKey, IFeedBlock } from './types';
import { createItemMutation } from '../testing';
import { FeedStoreIterator } from './feed-store-iterator';
import { createWritableFeedStream } from './stream';

const chance = new Chance();

const log = debug('dxos:echo:feed:iterator');
debug.enable('dxos:echo:*');

describe('feed store iterator', () => {
  test('basic iteration', async () => {
    const feedStore = new FeedStore(ram, { feedOptions: { valueEncoding: codec } });
    await feedStore.open();

    const selector = async (feedKey: FeedKey) => {
      log('Select:', humanize(feedKey));
      return true;
    };

    const sequencer = (candidates: IFeedBlock[]) => {
      log('Sequence:', JSON.stringify(candidates, jsonReplacer, 2));
      return 0;
    };

    // TODO(burdon): API: Iterator maintains map of selected feeds that can be mutated?
    const iterator = await FeedStoreIterator.create(feedStore, selector, sequencer);

    const config = {
      numFeeds: 2,
      numMessages: 5
    };

    const streams = [];
    for (const i of Array.from({ length: config.numFeeds }, (_, i) => i + 1)) {
      const feed = await feedStore.openFeed(`feed-${i}`);
      const stream = createWritableFeedStream(feed);
      streams.push({ feed, stream });
    }

    log('Created:', JSON.stringify({ feeds: streams.map(({ feed }) => humanize(feed.key)) }, undefined, 2));

    const keys = ['title', 'description'];
    for (let i = 0; i < config.numMessages; i++) {
      // TODO(burdon): Randomly create items.
      const { stream } = chance.pickone(streams);
      stream.write(createItemMutation(createId(), chance.pickone(keys), chance.word()));
    }

    let count = 0;
    for await (const message of iterator) {
      log(JSON.stringify(message, jsonReplacer, 2));
      if (++count === config.numMessages) {
        break;
      }
    }

    expect(count).toBe(config.numMessages);
  });
});
