//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { IHaloStream } from '../items';
import { jsonReplacer } from '../proto';
import { PartyProcessor } from './party-processor';

/**
 * Party processor for testing.
 */
export class TestPartyProcessor extends PartyProcessor {
  async _processMessage (message: IHaloStream): Promise<void> {
    const { data: { genesis } } = message;

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
