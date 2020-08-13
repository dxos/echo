//
// Copyright 2020 DXOS.org
//

import ram from 'random-access-memory';

import { FeedStore } from '@dxos/feed-store';

import { ModelFactory } from '@dxos/experimental/dist/models';
import { createWritableFeedStream } from '@dxos/experimental/dist/pipeline';
import { ItemManager } from './item-manager';

describe('items', () => {
  test('item construction', async () => {
    const feedStore = new FeedStore(ram);
    await feedStore.initialize();
    const feed = await feedStore.openFeed('test-feed');

    const modelFactory = new ModelFactory();
    const itemManager = new ItemManager(modelFactory, createWritableFeedStream(feed));
    expect(itemManager).toBeTruthy();
  });
});
