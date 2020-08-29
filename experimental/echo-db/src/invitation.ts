//
// Copyright 2020 DXOS.org
//

import { FeedKey, PartyKey } from '@dxos/experimental-echo-protocol';
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
  newFeedKey: FeedKey; // TODO(burdon): Rename peerFeedKey?
}

/**
 * Created by sender.
 */
export class Invitation {
  constructor (
    private readonly _partyProcessor: PartyProcessor,
    public readonly request: InvitationRequest
  ) {}

  async finalize (response: InvitationResponse) {
    return this._partyProcessor.admitFeed(response.newFeedKey);
  }
}

/**
 *
 */
export class InvitationResponder {
  constructor (
    public readonly party: Party,
    public readonly response: InvitationResponse
  ) {}
}
