//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import ram from 'random-access-memory';

import { createId, createKeyPair, humanize } from '@dxos/crypto';
import { FeedStore } from '@dxos/feed-store';

import { createOrderedFeedStream, createWritableFeedStream, FeedKey, IFeedBlock } from '../feeds';
import { IEchoStream } from '../items';
import { codec, jsonReplacer } from '../proto';
import { createWritable, latch } from '../util';
import { Pipeline } from './pipeline';
import { createAppendPropertyMutation } from '../testing';

const log = debug('dxos:echo:pipeline:test');
debug.enable('dxos:echo:*');

describe('pipeline', () => {
  test('streams', async () => {
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

    // TODO(burdon): Pass into pipeline (instead of feedStore).
    const iterator = await createOrderedFeedStream(feedStore, selector, sequencer);

    const { publicKey: partyKey } = createKeyPair();
    const pipeline = new Pipeline(feedStore, partyKey);
    const [readStream] = await pipeline.open();
    expect(readStream).toBeTruthy();

    //
    // Pipeline consumer.
    // TODO(burdon): Check order.
    //
    const numMessages = 5;
    const [counter, updateCounter] = latch(numMessages);
    readStream.pipe(createWritable<IEchoStream>(async message => {
      console.log('###', JSON.stringify(message, jsonReplacer, 2));
      updateCounter();
    }));

    //
    // Write directly to feed store.
    // TODO(burdon): Write to multiple feeds.
    //
    const feed = await feedStore.openFeed('test-feed');
    const writeStream = createWritableFeedStream(feed);

    const itemId = createId();
    for (let i = 0; i < numMessages; i++) {
      const message = createAppendPropertyMutation(itemId, 'value', String(i));
      writeStream.write(message);
    }

    await counter;
  });
});
