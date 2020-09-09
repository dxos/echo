//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { createFeedAdmitMessage, createKeyAdmitMessage, Keyring, createEnvelopeMessage } from '@dxos/credentials';
import { FeedKey, PartyKey } from '@dxos/experimental-echo-protocol';

import { PartyProcessor, Party } from './parties';
import { Feed } from 'hypercore';
import pify from 'pify';

// TODO(burdon): Document these wrt credentials protocol buffer types. Move Request/Response to @dxos/credentials?

/**
 *
 */
export interface InvitationRequest {
  partyKey: PartyKey;
  feeds: FeedKey[];
}

/**
 *
 */
export interface InvitationResponse {
  peerFeedKey: FeedKey,
  keyAdmitMessage: any // TODO(burdon): HALO type?
  feedAdmitMessage: any // TODO(burdon): HALO type?
}

/**
 * Created by sender.
 */
export class Invitation {
  constructor (
    private readonly _feed: Feed,
    public readonly request: InvitationRequest,
    private readonly _keyring: Keyring,
    private readonly _partyKey: PartyKey,
    private readonly _identityKeypair: any,
  ) {}

  async finalize (response: InvitationResponse) {
    assert(response);

    await pify(this._feed.append.bind(this._feed))({
      halo: createEnvelopeMessage(this._keyring, Buffer.from(this._partyKey), response.keyAdmitMessage, this._identityKeypair, null)
    })

    await pify(this._feed.append.bind(this._feed))({ halo: response.feedAdmitMessage });
  }
}

/**
 *
 */
export class InvitationResponder {
  public readonly response: InvitationResponse;
  constructor (
    keyring: any,
    public readonly party: Party,
    feedKeyPair: any, // TODO(burdon): Crypto Type def? See types.ts.
    identityKeyPair: any, 
  ) {
    this.response = {
      peerFeedKey: feedKeyPair.publicKey,
      // TODO(burdon): Why convert party.key?
      keyAdmitMessage: createKeyAdmitMessage(keyring, Buffer.from(party.key), identityKeyPair),
      feedAdmitMessage: createFeedAdmitMessage(keyring, Buffer.from(party.key), feedKeyPair, identityKeyPair)
    };
  }
}
