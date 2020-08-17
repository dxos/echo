//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';

import { IHaloStream } from '../items';
import { PartyKey } from './types';
import { jsonReplacer } from '../proto';

const log = debug('dxos:echo:party-processor');

/**
 * Manages current party state (e.g., admitted feeds).
 */
// TODO(burdon): Base class extended by HALO.
export class PartyProcessor {
  private readonly _feedKeys = new Set();

  private readonly _partyKey: PartyKey;

  constructor (partyKey: PartyKey) {
    assert(partyKey);
    this._partyKey = partyKey;
  }

  get partyKey () {
    return this._partyKey;
  }

  get feedKeys () {
    return Array.from(this._feedKeys);
  }

  async processMessage (message: IHaloStream) {
    const { data } = message;
    log(`Processing: ${JSON.stringify(message, jsonReplacer)}`);

    if (data.genesis) {
      const { partyKey, feedKey } = data.genesis;
      assert(partyKey === this._partyKey);
      assert(feedKey);
      this._feedKeys.add(feedKey);
      return;
    }

    throw new Error(`Invalid message: ${JSON.stringify(message, jsonReplacer)}`);
  }
}
