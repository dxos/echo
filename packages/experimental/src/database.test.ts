//
// Copyright 2020 DXOS.org
//

import debug from 'debug';

import { humanize } from '@dxos/crypto';

import { Database } from './database';
import { Party } from './parties';
import { TestModel } from './testing';
import { ModelFactory } from './models';

const log = debug('dxos:echo:testing');
debug.enable('dxos:echo:*');

describe('api tests', () => {
  test('api', async () => {
    const modelFactory = new ModelFactory().registerModel(TestModel.type, TestModel);
    const db = new Database({ modelFactory });

    const parties = await db.queryParties({ open: true });
    log('Parties:', parties.value.map(party => humanize(party.key)));
    expect(parties.value).toHaveLength(0);

    const unsubscribe = parties.subscribe(async (parties: Party[]) => {
      log('Parties:', parties.map(party => humanize(party.key)));
      expect(parties).toHaveLength(1);
      parties.map(async party => {
        const items = await party.queryItems();
        items.value.forEach(item => {
          log('Item:', JSON.stringify({ type: item.type, id: item.id }));
        });

        const result = await party.queryItems({ type: 'document' });
        expect(result.value).toHaveLength(2);
      });

      unsubscribe();
    });

    const party = await db.createParty();
    log('Created:', humanize(party.key));

    await party.createItem('document', TestModel.type);
    await party.createItem('document', TestModel.type);
    await party.createItem('canvas', TestModel.type);
  });
});
