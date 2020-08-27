//
// Copyright 2020 DXOS.org
//

import { Event } from '@dxos/async';
import { PartyKey } from '@dxos/experimental-echo-protocol';
import { Party, PartyFilter, PartyManager } from './parties';
import { ResultSet } from './result';
import { Invitation, InvitationResponse } from './invitation';

/**
 * This is the root object for the ECHO database.
 * It is used to query and mutate the statse of all data accessible to the containing node.
 * Shared datasets are contained within `Parties` which consiste of immutable messages within multiple `Feeds`.
 * These feeds are replicated across peers in the network and stored in the `FeedStore`.
 * Parties contain queryable data `Items` which are reconstituted from an ordered stream of mutations by
 * different `Models`. The `Model` also handles `Item` mutations, which are streamed back to the `FeedStore`.
 * When opened, `Parties` construct a pair of inbound and outbound pipelines that connects each `Party` specific
 * `ItemManager` to the `FeedStore`.
 * Messages are streamed into the pipeline (from the `FeedStore`) in logical order, determined by the
 * `Spactime` `Timeframe` (which implements a vector clock).
 */
export class Database {
  private readonly _partyUpdate = new Event<Party>();

  constructor (private readonly _partyManager: PartyManager) { }

  /**
   * Opens the pary and constructs the inbound/outbound mutation streams.
   */
  async open () {
    await this._partyManager.open();
  }

  /**
   * Closes the party and associated streams.
   */
  async close () {
    await this._partyManager.close();
  }

  /**
   * Creates a new party.
   */
  async createParty (): Promise<Party> {
    await this.open();

    const party = await this._partyManager.createParty();
    await party.open();

    // Notify update event.
    setImmediate(() => this._partyUpdate.emit(party));

    return party;
  }

  /**
   * Returns an individual party by it's key.
   * @param {PartyKey} partyKey
   */
  async getParty (partyKey: PartyKey): Promise<Party | undefined> {
    await this.open();

    return this._partyManager.parties.find(party => Buffer.compare(party.key, partyKey) === 0);
  }

  /**
   * Queries for a set of Parties matching the optional filter.
   * @param {PartyFilter} filter
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async queryParties (filter?: PartyFilter): Promise<ResultSet<Party>> {
    await this.open();

    return new ResultSet<Party>(this._partyUpdate, () => this._partyManager.parties);
  }

  async joinParty (invitation: Invitation) {
    const { party, ownFeed } = await this._partyManager.constructRemoteParty(invitation.partyKey, invitation.feeds);
    await party.open();

    const response: InvitationResponse = { newFeedKey: ownFeed };

    return { party, response };
  }
}
