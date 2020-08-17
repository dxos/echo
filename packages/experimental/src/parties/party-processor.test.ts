//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';

import { createKeyPair } from '@dxos/crypto';

import { IHaloStream } from '../items';
import { createPartyGenesis } from '../testing';
import { PartyProcessor } from './party-processor';

const log = debug('dxos:echo:party-processor:test');
debug.enable('dxos:echo:*');

describe('party-processor', () => {
  test('basic messages', async () => {
    const { publicKey: partyKey } = createKeyPair();
    const partyProcessor = new PartyProcessor(partyKey);
    expect(partyProcessor.partyKey).toBeTruthy();

    const { publicKey: feedKey } = createKeyPair();
    const { halo: data } = createPartyGenesis(partyKey, feedKey);
    assert(data);
    const message: IHaloStream = {
      meta: {
        feedKey,
        seq: 0
      },
      data
    };

    await partyProcessor.processMessage(message);
    expect(partyProcessor.feedKeys).toHaveLength(1);
    log(partyProcessor.feedKeys);
  });
});
