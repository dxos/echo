//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';

import { IHaloStream } from '../items';
import { PartyKey } from './types';
import { jsonReplacer } from '../proto';
import { FeedKey } from '../feeds';

const log = debug('dxos:echo:party-processor');

/**
 * Manages current party state (e.g., admitted feeds).
 */
// TODO(burdon): Base class extended by HALO.
export class PartyProcessor {
  private readonly _feedKeys = new Set<FeedKey>();

  private readonly _partyKey: PartyKey;

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

  containsFeed (feedKey: FeedKey) {
    return Array.from(this._feedKeys.values()).findIndex(k => Buffer.compare(k, feedKey) === 0) !== -1;
  }

  async processMessage (message: IHaloStream) {
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
