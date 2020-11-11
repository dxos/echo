//
// Copyright 2020 DXOS.org
//

import ram from 'random-access-memory';

import { createKeyPair, PublicKey } from '@dxos/crypto';
import { createFeedWriter } from '@dxos/echo-protocol';
import { FeedStore } from '@dxos/feed-store';
import { ModelFactory } from '@dxos/model-factory';

import { ItemManager } from './item-manager';
import { TimeframeClock } from './timeframe-clock';

describe('items', () => {
  test('item construction', async () => {
    const feedStore = new FeedStore(ram);
    await feedStore.open();
    const feed = await feedStore.openFeed('test-feed');

    const { publicKey: partyKey } = createKeyPair();

    const modelFactory = new ModelFactory();
    const itemManager = new ItemManager(PublicKey.from(partyKey), modelFactory, new TimeframeClock(), createFeedWriter(feed));
    expect(itemManager).toBeTruthy();
  });
});
