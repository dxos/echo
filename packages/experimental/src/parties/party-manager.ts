//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import hypercore from 'hypercore';

import { Event } from '@dxos/async';
import { createKeyPair, keyToString } from '@dxos/crypto';
import { FeedDescriptor, FeedStore } from '@dxos/feed-store';

import { Options } from '../database';
import { createOrderedFeedStream, createWritableFeedStream } from '../feeds';
import { ModelFactory } from '../models';
import { createPartyGenesis } from '../testing';
import { Party } from './party';
import { Pipeline } from './pipeline';
import { PartyKey } from './types';
import { TestPartyProcessor } from './test-party-processor';
import pify from 'pify';

const log = debug('dxos:echo:party-manager');

/**
 * Manages the life-cycle of parties.
 */
export class PartyManager {
  // TODO(burdon): Buffer equivalence doesn't work for map.
  // TODO(burdon): Query from data store (i.e., not just open parties).
  private readonly _parties = new Map<string, Party>();

  private readonly _feedStore: FeedStore;
  private readonly _modelFactory: ModelFactory;
  private readonly _options: Options;

  private readonly _onFeed: (feed: hypercore.Feed, descriptor: FeedDescriptor) => void;

  readonly update = new Event<Party>();

  /**
   * @param feedStore
   * @param modelFactory
   * @param options
   */
  constructor (feedStore: FeedStore, modelFactory: ModelFactory, options?: Options) {
    assert(feedStore);
    assert(modelFactory);
    this._feedStore = feedStore;
    this._modelFactory = modelFactory;
    this._options = options || {};

    this._onFeed = async (feed: hypercore.Feed, descriptor: FeedDescriptor) => {
      // NOTE: Party creation (below) creates a new feed which immediately triggers this event.
      // We need to defer execution of the event processing until the Party object has been
      // constructed and mapped -- otherwise we will inadvertantly cause a new instance to be created.
      setImmediate(async () => {
        const { metadata: { partyKey } } = descriptor;
        const party = await this._getOrCreateParty(partyKey);
        await party.open();
        this.update.emit(party);
      });
    };
  }

  async open () {
    await this._feedStore.open();
    (this._feedStore as any).on('feed', this._onFeed);
  }

  async close () {
    (this._feedStore as any).off('feed', this._onFeed);
    await this._feedStore.close();
  }

  get parties (): Party[] {
    return Array.from(this._parties.values());
  }

  /**
   * Creates a new party.
   */
  async createParty (): Promise<Party> {
    // TODO(burdon): Assert doesn't exist.

    // Create party key.
    const { publicKey: partyKey } = createKeyPair();
    const feed = await this._feedStore.openFeed(keyToString(partyKey), { metadata: { partyKey } } as any);
    const party = await this._constructParty(partyKey);
    log(`Created: ${String(party)}`);

    // TODO(burdon): Call party processor to write genesis, etc.
    const message = createPartyGenesis(partyKey, feed.key);
    await pify(feed.append.bind(feed))(message);

    return party;
  }

  /**
   * Gets existing party object or constructs a new one.
   *
   * @param partyKey
   */
  async _getOrCreateParty (partyKey: PartyKey): Promise<Party> {
    let party = this._parties.get(keyToString(partyKey));
    if (!party) {
      party = await this._constructParty(partyKey);
    }

    return party;
  }

  /**
   * Constructs a new party object.
   *
   * @param partyKey
   */
  async _constructParty (partyKey: PartyKey): Promise<Party> {
    // TODO(burdon): Ensure that this node's feed (for this party) has been created first.
    const descriptor = this._feedStore.getDescriptors().find(descriptor => descriptor.path === keyToString(partyKey));
    assert(descriptor, `Feed not found for party: ${keyToString(partyKey)}`);
    const feed = descriptor.feed;

    const partyProcessor = new TestPartyProcessor(partyKey, feed.key);

    // Create pipeline.
    const feedReadStream = await createOrderedFeedStream(
      this._feedStore, partyProcessor.feedSelector, partyProcessor.messageSelector);
    const feedWriteStream = createWritableFeedStream(feed);
    const pipeline = new Pipeline(partyProcessor, feedReadStream, feedWriteStream, this._options);

    // Create party.
    const party = new Party(this._modelFactory, pipeline);
    this._parties.set(keyToString(party.key), party);

    return party;
  }
}
