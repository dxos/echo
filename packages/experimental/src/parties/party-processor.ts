//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';

import { FeedKey, FeedSelector, IFeedBlock, MessageSelector } from '../feeds';
import { IHaloStream } from '../items';
import { jsonReplacer } from '../proto';
import { FeedKeyMapper, Spacetime } from '../spacetime';
import { PartyKey } from './types';

const log = debug('dxos:echo:party-processor');

const spacetime = new Spacetime(new FeedKeyMapper('feedKey'));

/**
 * Manages current party state (e.g., admitted feeds).
 */
export abstract class PartyProcessor {
  protected readonly _partyKey: PartyKey;

  // Active set of admitted feeds.
  protected readonly _feedKeys = new Set<FeedKey>();

  // Current timeframe.
  private _timeframe = spacetime.createTimeframe();

  /**
   * @param partyKey
   * @param feedKey - Genesis feed for node.
   */
  constructor (partyKey: PartyKey, feedKey: FeedKey) {
    assert(partyKey);
    assert(feedKey);
    this._partyKey = partyKey;
    this._feedKeys.add(feedKey);
  }

  get partyKey () {
    return this._partyKey;
  }

  get feedKeys () {
    return Array.from(this._feedKeys);
  }

  get timeframe () {
    return this._timeframe;
  }

  get feedSelector (): FeedSelector {
    return (feedKey: FeedKey) =>
      Array.from(this._feedKeys.values()).findIndex(k => Buffer.compare(k, feedKey) === 0) !== -1;
  }

  // TODO(burdon): Factor out from feed-store-iterator test.
  get messageSelector (): MessageSelector {
    return (candidates: IFeedBlock[]) => 0;
  }

  updateTimeframe (key: FeedKey, seq: number) {
    this._timeframe = spacetime.merge(this._timeframe, spacetime.createTimeframe([[key as any, seq]]));
  }

  abstract async processMessage (message: IHaloStream): Promise<void>;
}

/**
 * Party processor for testing.
 */
// TODO(burdon): Move when refactoring experimental.
export class TestPartyProcessor extends PartyProcessor {
  async processMessage (message: IHaloStream): Promise<void> {
    const { data: { genesis } } = message;
    log(`Processing: ${JSON.stringify(message, jsonReplacer)}`);

    //
    // Party genesis.
    //
    if (genesis) {
      const { partyKey, feedKey } = genesis;
      assert(partyKey === this._partyKey);
      assert(feedKey);
      this._feedKeys.add(feedKey);
      return;
    }

    throw new Error(`Invalid message: ${JSON.stringify(message, jsonReplacer)}`);
  }
}
