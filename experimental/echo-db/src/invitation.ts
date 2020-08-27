import { FeedKey, PartyKey } from '@dxos/experimental-echo-protocol';
import { PartyProcessor } from './parties';

export interface Invitation {
  partyKey: PartyKey
  feeds: FeedKey[]
}

export interface InvitationResponse {
  newFeedKey: FeedKey
}

export class Inviter {
  constructor(
    public readonly invitation: Invitation,
    private readonly _partyProcessor: PartyProcessor,
  ) {}

  finalize(response: InvitationResponse) {
    this._partyProcessor.admitFeed(response.newFeedKey);
  }
}