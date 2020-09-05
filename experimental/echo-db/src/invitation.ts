//
// Copyright 2020 DXOS.org
//

import { FeedKey, PartyKey } from '@dxos/experimental-echo-protocol';
import { createFeedAdmitMessage } from '@dxos/credentials';

import { PartyProcessor, Party } from './parties';

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
  feedAdmitMessage: any // TODO(burdon): HALO type?
}

/**
 * Created by sender.
 */
export class Invitation {
  constructor (
    private readonly _partyProcessor: PartyProcessor,
    private readonly _writeStream: NodeJS.WritableStream,
    public readonly request: InvitationRequest
  ) {}

  async finalize (response: InvitationResponse) {
    await this._partyProcessor.admitFeed(response.peerFeedKey);
    this._writeStream.write(response.feedAdmitMessage);
  }
}

/**
 *
 */
export class InvitationResponder {
  public readonly response: InvitationResponse;

  constructor (
    public readonly party: Party,
    keyring: any,
    feedKeypair: any
  ) {
    this.response = {
      peerFeedKey: feedKeypair.key,
      feedAdmitMessage: createFeedAdmitMessage(keyring, Buffer.from(party.key), feedKeypair)
    };
  }
}
