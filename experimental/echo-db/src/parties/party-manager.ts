//
// Copyright 2020 DXOS.org
//

import { Event, Lock } from '@dxos/async';
import { keyToString } from '@dxos/crypto';
import { FeedKey, PartyKey, PublicKey } from '@dxos/experimental-echo-protocol';
import { ModelFactory } from '@dxos/experimental-model-factory';
import { ComplexMap } from '@dxos/experimental-util';
import { FeedStore } from '@dxos/feed-store';
import assert from 'assert';
import debug from 'debug';
import { FeedStoreAdapter } from '../feed-store-adapter';
import { InvitationResponder } from '../invitation';
import { PartyFactory } from '../party-factory';
import { ReplicatorFactory } from '../replication';
import { Party } from './party';

const log = debug('dxos:echo:party-manager');

interface Options {
  readLogger?: NodeJS.ReadWriteStream;
  writeLogger?: NodeJS.ReadWriteStream;
  readOnly?: boolean;
}

/**
 * Manages the life-cycle of parties.
 */
export class PartyManager {
  // Map of parties by party key.
  private readonly _parties = new ComplexMap<PublicKey, Party>(keyToString);

  private readonly _feedStore: FeedStoreAdapter;
  private readonly _options: Options;

  // External event listener.
  // TODO(burdon): Wrap with subscribe.
  readonly update = new Event<Party>();

  private readonly _lock = new Lock();

  private readonly _partyFactory: PartyFactory;

  /**
   * @param feedStore
   * @param modelFactory
   * @param options
   */
  constructor (
    feedStore: FeedStore,
    modelFactory: ModelFactory,
    replicatorFactory?: ReplicatorFactory, // TODO(burdon): Make consistent.
    options?: Options
  ) {
    assert(feedStore);
    assert(modelFactory);
    this._feedStore = new FeedStoreAdapter(feedStore);
    this._options = options || {};

    this._partyFactory = new PartyFactory(this._feedStore, modelFactory, replicatorFactory, options);
  }

  get parties (): Party[] {
    return Array.from(this._parties.values());
  }

  async open () {
    return this._lock.executeSynchronized(async () => {
      await this._feedStore.open();

      // Iterate descriptors and pre-create Party objects.
      for (const partyKey of this._feedStore.enumerateParties()) {
        if (!this._parties.has(partyKey)) {
          const party = await this._partyFactory.constructParty(partyKey, []);
          this._parties.set(party.key, party);
          this.update.emit(party);
        }
      }
    });
  }

  async close () {
    await this._feedStore.close();
  }

  /**
   * Creates a new party, writing its genesis block to the stream.
   */
  async createParty (): Promise<Party> {
    return this._lock.executeSynchronized(async () => {
      assert(!this._options.readOnly);
      const party = await this._partyFactory.createParty();
      this._parties.set(party.key, party);
      this.update.emit(party);
      return party;
    });
  }

  /**
   * Construct a party object and start replicating with the remote peer that created that party.
   * @param partyKey
   * @param feeds Set of feeds belonging to that party
   */
  async addParty (partyKey: PartyKey, feeds: FeedKey[]) {
    return this._lock.executeSynchronized(async () => {
      log(`Add party partyKey=${keyToString(partyKey)} feeds=${feeds.map(keyToString)}`);
      assert(!this._parties.has(partyKey));
      const { party, keyring, feedKey } = await this._partyFactory.addParty(partyKey, feeds);
      this._parties.set(party.key, party);
      this.update.emit(party);
      return new InvitationResponder(keyring, party, feedKey);
    });
  }
}
