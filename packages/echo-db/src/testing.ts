//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import ram from 'random-access-memory';

import { Keyring, KeyStore } from '@dxos/credentials';
import { codec } from '@dxos/echo-protocol';
import { FeedStore } from '@dxos/feed-store';
import { ModelFactory } from '@dxos/model-factory';
import { NetworkManager, SwarmProvider } from '@dxos/network-manager';
import { ObjectModel } from '@dxos/object-model';
import { jsonReplacer } from '@dxos/util';

import { ECHO } from './echo';
import { FeedStoreAdapter } from './feed-store-adapter';
import { IdentityManager, PartyManager } from './parties';
import { PartyFactory } from './parties/party-factory';

const log = debug('dxos:echo:database:test,dxos:*:error');

export interface TestOptions {
  verboseLogging?: boolean
  storage?: any
  keyStorage?: any
  swarmProvider?: SwarmProvider
}

export async function createTestInstance ({
  verboseLogging = false,
  storage = ram,
  keyStorage = undefined,
  swarmProvider = new SwarmProvider()
}: TestOptions = {}) {
  const feedStore = new FeedStore(storage, { feedOptions: { valueEncoding: codec } });
  const feedStoreAdapter = new FeedStoreAdapter(feedStore);

  const identityManager = new IdentityManager(new Keyring(new KeyStore(keyStorage)));

  const modelFactory = new ModelFactory()
    .registerModel(ObjectModel);

  const options = verboseLogging ? {
    readLogger: (message: any) => { log('>>>', JSON.stringify(message, jsonReplacer, 2)); },
    writeLogger: (message: any) => { log('<<<', JSON.stringify(message, jsonReplacer, 2)); }
  } : undefined;

  const networkManager = new NetworkManager(feedStore, swarmProvider);
  const partyFactory = new PartyFactory(identityManager, feedStoreAdapter, modelFactory, networkManager, options);
  const partyManager = new PartyManager(identityManager, feedStoreAdapter, partyFactory);

  const echo = new ECHO(partyManager, options);

  return { echo, partyManager, modelFactory, identityManager, feedStoreAdapter, feedStore };
}
