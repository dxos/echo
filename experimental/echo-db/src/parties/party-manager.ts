//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';

import { Event, Lock } from '@dxos/async';
import { KeyType } from '@dxos/credentials';
import { keyToString } from '@dxos/crypto';
import { FeedKey, PartyKey, PublicKey } from '@dxos/experimental-echo-protocol';
import { ComplexMap } from '@dxos/experimental-util';

import { FeedStoreAdapter } from '../feed-store-adapter';
import { InvitationResponder } from '../invitation';
import { Party } from './party';
import { PartyFactory } from './party-factory';

const log = debug('dxos:echo:party-manager');

/**
 * Manages the life-cycle of parties.
 */
export class PartyManager {
  // Map of parties by party key.
  private readonly _parties = new ComplexMap<PublicKey, Party>(keyToString);

  private readonly _lock = new Lock();

  // External event listener.
  // TODO(burdon): Wrap with subscribe.
  readonly update = new Event<Party>();

  constructor (
    private readonly _feedStore: FeedStoreAdapter,
    private readonly _partyFactory: PartyFactory
  ) { }

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
<<<<<<< HEAD
    log(`Adding party partyKey=${keyToString(partyKey)} feeds=${feeds.map(keyToString)}`);
    const keyring = new Keyring();
    const feed = await this._feedStore.openFeed(keyToString(partyKey), { metadata: { partyKey } } as any);
    const feedKey = await keyring.addKeyRecord({
      publicKey: feed.key,
      secretKey: feed.secretKey,
      type: KeyType.FEED
    });

    const party = await this._constructParty(partyKey, feeds);
    await party.open();

    this.update.emit(party);

    return new InvitationResponder(keyring, party, feedKey);
  }

  /**
   * Gets existing party object or constructs a new one.
   * @param partyKey
   */
  async _getOrCreateParty (partyKey: PartyKey): Promise<Party> {
    return this._parties.get(partyKey) ?? await this._constructParty(partyKey);
  }

  /**
   * Constructs and registers a party object.
   * @param partyKey
   * @param feedKeys Extra set of feeds to be included in the party
   */
  async _constructParty (partyKey: PartyKey, feedKeys: FeedKey[] = []): Promise<Party> {
    // TODO(telackey): I added this lock as a workaround for a race condition in the existing (before this PR) party
    // creation code that caused intermittent database test failures for me. The race is between creating a Party, which
    // makes a new feed and calls _constructParty, and the FeedStore firing its onFeed event, the handler for which
    // calls _getOrCreateParty. If the event handler happens to be executed before the first call to _constructParty
    // has finished, this will result in _constructParty being called twice for the same party key.
    // For discussion: how to fix this race properly.
    return await this._lock.executeSynchronized(async () => {
      if (this._parties.has(partyKey)) {
        return this._parties.get(partyKey)!;
      }

      // TODO(burdon): Ensure that this node's feed (for this party) has been created first.
      //   I.e., what happens if remote feed is synchronized first triggering 'feed' event above.
      //   In this case create pipeline in read-only mode.
      const descriptor = this._feedStore.getDescriptors().find(descriptor => descriptor.path === keyToString(partyKey));
      assert(descriptor, `Feed not found for party: ${keyToString(partyKey)}`);
      const feed = descriptor.feed;

      // Create pipeline.
      // TODO(telackey): To use HaloPartyProcessor here we cannot keep passing FeedKey[] arrays around, instead
      // we need to use createFeedAdmitMessage to a write a properly signed message FeedAdmitMessage and write it,
      // like we do above for the PartyGenesis message.
      const partyProcessorFactory = this._options.partyProcessorFactory ?? ((partyKey) => new HaloPartyProcessor(partyKey));
      const partyProcessor = partyProcessorFactory(partyKey);
      await partyProcessor.addHints([feed.key, ...feedKeys]);

      const feedReadStream = await createOrderedFeedStream(
        this._feedStore, partyProcessor.feedSelector, partyProcessor.messageSelector);
      const feedWriteStream = createWritableFeedStream(feed);
      const pipeline =
        new Pipeline(partyProcessor, feedReadStream, feedWriteStream, this.replicatorFactory, this._options);

      // Create party.
      const party = new Party(this._modelFactory, pipeline, partyProcessor);
      assert(!this._parties.has(party.key));
=======
    return this._lock.executeSynchronized(async () => {
      log(`Adding party partyKey=${keyToString(partyKey)} feeds=${feeds.map(keyToString)}`);
      assert(!this._parties.has(partyKey));
      const { party, feedKey } = await this._partyFactory.addParty(partyKey, feeds);
>>>>>>> master
      this._parties.set(party.key, party);
      this.update.emit(party);
      return new InvitationResponder(this._partyFactory.keyring, party, feedKey, this._partyFactory.identityKey);
    });
  }
}
