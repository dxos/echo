import { FeedKey, PartyKey } from '@dxos/experimental-echo-protocol';
import { PartyProcessor, Party } from './parties';
import { createFeedAdmitMessage } from '@dxos/credentials';

export interface Invitation {
  partyKey: PartyKey
  feeds: FeedKey[]
}

export interface InvitationResponse {
  newFeedKey: FeedKey,
  feedAdmitMessage: any,
}

export class Inviter {
  constructor (
    public readonly invitation: Invitation,
    private readonly _partyProcessor: PartyProcessor,
    private readonly _writeStream: NodeJS.WritableStream
  ) {}

  finalize (response: InvitationResponse) {
    this._partyProcessor.admitFeed(response.newFeedKey);

    this._writeStream.write(response.feedAdmitMessage);
  }
}

export class InvitationResponder {
  public readonly response: InvitationResponse;

  constructor (
    public readonly party: Party,
    keyring: any,
    feedKeypair: any
  ) {
    this.response = {
      newFeedKey: feedKeypair.key,
      feedAdmitMessage: createFeedAdmitMessage(keyring, Buffer.from(party.key), feedKeypair)
    };
  }
}
