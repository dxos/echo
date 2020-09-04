//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { PartyCredential, getPartyCredentialMessageType } from '@dxos/credentials';
import { IHaloStream, PublicKey, FeedKey, PartyKey } from '@dxos/experimental-echo-protocol';
import { jsonReplacer } from '@dxos/experimental-util';

import { PartyProcessor } from './party-processor';

/**
 * A Set which handles PublicKeys (Buffers) as entries.
 * (This implementation is not optimized.)
 */
class KeySet extends Set<PublicKey> {
  private _equalsMatch (value: PublicKey) {
    for (const existing of this.values()) {
      if (Buffer.compare(existing, value) === 0) {
        return existing;
      }
    }
    return undefined;
  }

  public add (value: PublicKey) {
    if (!this.has(value)) {
      super.add(value);
    }
    return this;
  }

  public has (value: PublicKey) {
    return !!this._equalsMatch(value);
  }

  public delete (value: PublicKey) {
    const existing = this._equalsMatch(value);
    return existing ? super.delete(existing) : false;
  }
}

/**
 * Party processor for testing.
 */
export class TestPartyProcessor extends PartyProcessor {
  private _feedKeys = new KeySet();
  private _memberKeys = new KeySet();

  async addHints (feedKeys: FeedKey[]) {
    for (const feedKey of feedKeys) {
      this._feedKeys.add(feedKey);
    }
  }

  async _processMessage (message: IHaloStream): Promise<void> {
    const { data } = message;

    switch (getPartyCredentialMessageType(data)) {
      case PartyCredential.Type.PARTY_GENESIS: {
        const { partyKey, feedKey, admitKey } = data.payload.signed.payload.contents;
        assert(partyKey);
        assert(feedKey);
        assert(admitKey);
        assert(Buffer.compare(partyKey, this._partyKey) === 0);
        this._feedKeys.add(feedKey);
        this._memberKeys.add(admitKey);
        return;
      }
      case PartyCredential.Type.FEED_ADMIT:
        throw new Error('Not implemented'); // TODO(marik-d): Handle feed admit messages instead of having `admitFeed` method.
      default:
        throw new Error(`Invalid message: ${JSON.stringify(message, jsonReplacer)}`);
    }
  }

  public get feedKeys () {
    return Array.from(this._feedKeys.values());
  }

  public get memberKeys () {
    return Array.from(this._memberKeys.values());
  }

  protected _addFeedKey (key: FeedKey) {
    this._feedKeys.add(key);
    this._feedAdded.emit(key);
  }

  async admitFeed (key: FeedKey) {
    this._addFeedKey(key);
  }
}
