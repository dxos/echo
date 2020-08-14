//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import ram from 'random-access-memory';

import { humanize } from '@dxos/crypto';
import { FeedStore } from '@dxos/feed-store';

import { Database } from './database';
import { Party } from './parties';
import { TestModel } from './testing';
import { ModelFactory } from './models';
import { codec } from './proto';

const log = debug('dxos:echo:testing');
debug.enable('dxos:echo:*');

// TODO(burdon): Reactive components (Database, Party, Item, Model)
// TODO(burdon): Ensure streams are closed when objects are destroyed (on purpose or on error).
// TODO(burdon): Ensure event handlers are removed.

describe('api tests', () => {
  test('create party and items.', async () => {
    const feedStore = new FeedStore(ram, { feedOptions: { valueEncoding: codec } });
    const modelFactory = new ModelFactory().registerModel(TestModel.type, TestModel);
    const db = new Database({ feedStore, modelFactory });
    await db.initialize();

    const parties = await db.queryParties({ open: true });
    log('Parties:', parties.value.map(party => humanize(party.key)));
    expect(parties.value).toHaveLength(0);

    const unsubscribe = parties.subscribe(async (parties: Party[]) => {
      log('Parties:', parties.map(party => humanize(party.key)));
      expect(parties).toHaveLength(1);
      parties.map(async party => {
        const items = await party.queryItems();
        items.value.forEach(item => {
          log('Item:', String(item));
        });

        const result = await party.queryItems({ type: 'document' });
        expect(result.value).toHaveLength(2);
      });

      unsubscribe();
    });

    const party = await db.createParty();
    log('Created:', String(party));

    await party.createItem('document', TestModel.type);
    await party.createItem('document', TestModel.type);
    await party.createItem('canvas', TestModel.type);
  });
});
