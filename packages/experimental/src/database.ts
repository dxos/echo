//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';

import { Event } from '@dxos/async';
import { createKeyPair } from '@dxos/crypto';
import { FeedStore } from '@dxos/feed-store';

import { ModelFactory } from './models';
import { Party, PartyFilter, PartyStreams } from './parties';
import { ResultSet } from './result';

const log = debug('dxos:echo:database');

/**
 * Root object for the ECHO databse.
 */
export class Database {
  private readonly _partyUpdate = new Event<Party>();
  private readonly _parties = new Map<Buffer, Party>();
  private readonly _feedStore: FeedStore;
  private readonly _modelFactory: ModelFactory;

  constructor ({ feedStore, modelFactory }: { feedStore: FeedStore, modelFactory: ModelFactory }) {
    assert(modelFactory);
    this._feedStore = feedStore;
    this._modelFactory = modelFactory;
  }

  async initialize () {
    await this._feedStore.open();
  }

  /**
   * Creates a new party.
   */
  async createParty (): Promise<Party> {
    await this.initialize();

    const { publicKey: key } = createKeyPair();
    const partyStreams = new PartyStreams(this._feedStore, key);
    const party = await new Party(partyStreams, this._modelFactory).open();
    this._parties.set(party.key, party);

    // Notify update event.
    // TODO(burdon): How to distinguish event types (create, update, etc.) and propagation?
    setImmediate(() => this._partyUpdate.emit(party));

    return party;
  }

  /**
   * @param filter
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async queryParties (filter?: PartyFilter): Promise<ResultSet<Party>> {
    return new ResultSet<Party>(this._partyUpdate, () => Array.from(this._parties.values()));
  }
}
