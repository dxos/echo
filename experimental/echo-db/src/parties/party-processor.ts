//
// Copyright 2020 DXOS.org
//

import debug from 'debug';

import { Event } from '@dxos/async';
import { Party as PartyStateMachine, KeyType, PartyCredential, getPartyCredentialMessageType } from '@dxos/credentials';
import { keyToString } from '@dxos/crypto';
import { PartyKey, IHaloStream, FeedKey, Spacetime, FeedKeyMapper, MessageSelector, FeedBlock } from '@dxos/experimental-echo-protocol';
import { jsonReplacer } from '@dxos/experimental-util';

const log = debug('dxos:echo:halo-party-processor');

const spacetime = new Spacetime(new FeedKeyMapper('feedKey'));

export interface FeedSetProvider {
  get(): FeedKey[]
  added: Event<FeedKey>
}

/**
 * Party processor for testing.
 */
export class PartyProcessor {
  protected readonly _partyKey: PartyKey;

  protected readonly _feedAdded = new Event<FeedKey>()

  // Current timeframe.
  // TODO(marik-d): Move into separate class
  private _timeframe = spacetime.createTimeframe();

  private readonly _stateMachine: PartyStateMachine;

  constructor (partyKey: PartyKey) {
    this._partyKey = partyKey;
    this._stateMachine = new PartyStateMachine(partyKey);

    // TODO(telackey) @dxos/credentials was only half converted to TS. In its current state, the KeyRecord type
    // is not exported, and the PartyStateMachine being used is not properly understood as an EventEmitter by TS.
    // Casting to 'any' is a workaround for the compiler, but the fix is fully to convert @dxos/credentials to TS.
    const state = this._stateMachine as any;

    state.on('admit:feed', (keyRecord: any) => {
      log(`Feed key admitted ${keyToString(keyRecord.publicKey)}`);
      this._feedAdded.emit(keyRecord.publicKey);
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state.on('admit:key', (keyRecord: any) => {
      // this._keyAdded.emit(keyRecord.publicKey);
    });
  }

  get partyKey () {
    return this._partyKey;
  }

  get timeframe () {
    return this._timeframe;
  }

  get feedKeys () {
    return this._stateMachine.memberFeeds;
  }

  get memberKeys () {
    return this._stateMachine.memberKeys;
  }

  get messageSelector (): MessageSelector {
    return (candidates: FeedBlock[]) => {
      for (let i = 0; i < candidates.length; i++) {
        const { key: feedKey, data: { halo: haloMessage } } = candidates[i];
        // TODO(telackey): We check memberCredentials because we want to rely only on FeedAdmit messages that have been fully
        // processed. Hinted keys, while trusted, should not be used for ordering purposes.
        if (this._stateMachine.isMemberFeed(feedKey) && this._stateMachine.memberCredentials.has(keyToString(feedKey))) {
          // Accept if this Feed has already had its admission to the Party procesed.
          return i;
        } else if (!this._stateMachine.memberCredentials.size && haloMessage) {
          // Accept if it is the PartyGenesis message.
          // TODO(telackey): Add check it is for the right party.
          const messageType = getPartyCredentialMessageType(haloMessage);
          if (PartyCredential.Type.PARTY_GENESIS === messageType) {
            return i;
          }
        }
      }
      // Else keep waiting.
      return undefined;
    };
  }

  // TODO(burdon): Rename xxxProvider.
  getActiveFeedSet (): FeedSetProvider {
    return {
      get: () => this.feedKeys,
      added: this._feedAdded
    };
  }

  async addHints (feedKeys: FeedKey[]) {
    log(`addHints ${feedKeys.map(key => keyToString(key))}`);
    // Gives state machine hints on initial feed set from where to read party genesis message.
    // TODO(telackey): Hints were not intended to provide a feed set for PartyGenesis messages. They are about
    // what feeds and keys to trust immediately after Greeting, before we have had the opportunity to replicate the
    // credential messages for ourselves.
    await this._stateMachine.takeHints(feedKeys.map(publicKey => ({ publicKey, type: KeyType.FEED })));
  }

  updateTimeframe (key: FeedKey, seq: number) {
    this._timeframe = spacetime.merge(this._timeframe, spacetime.createTimeframe([[key as any, seq]]));
  }

  async processMessage (message: IHaloStream): Promise<void> {
    log(`Processing: ${JSON.stringify(message, jsonReplacer)}`);
    const { data } = message;
    return this._stateMachine.processMessages([data]);
  }
}
