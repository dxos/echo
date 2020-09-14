//
// Copyright 2020 DXOS.org
//

import { Feed } from 'hypercore';

import { keyToBuffer, keyToString } from '@dxos/crypto';
import { FeedKey, PartyKey } from '@dxos/experimental-echo-protocol';
import { FeedStore } from '@dxos/feed-store';
import { randomBytes } from '@dxos/crypto';
import assert from 'assert';

export class FeedStoreAdapter {
  constructor (
    private readonly _feedStore: FeedStore
  ) { }

  get feedStore () {
    return this._feedStore;
  }

  async open () {
    await this._feedStore.open();
  }

  async close () {
    await this._feedStore.close();
  }

  getFeed (feedKey: FeedKey): Feed | undefined {
    const descriptor = this._feedStore.getDescriptors().find(descriptor => descriptor.key.equals(feedKey));
    return descriptor?.feed;
  }

  queryWritableFeed(partyKey: PartyKey): Feed | undefined {
    const descriptor = this._feedStore.getDescriptors().find(descriptor => 
      descriptor.metadata.partyKey.equals(partyKey) &&
        descriptor.metadata.writable
    );
    return descriptor?.feed;
  }

  createWritableFeed(partyKey: PartyKey): Promise<Feed> {
    assert(partyKey instanceof Uint8Array || Buffer.isBuffer(partyKey)); // TODO(marik-d): Something wrong here, Buffer should be a subclass of Uint8Array but it isn't here
    assert(!this.queryWritableFeed(partyKey), 'Writable feed already exists');
    return this._feedStore.openFeed(
      keyToString(randomBytes()),
      { metadata: { partyKey, writable: true } } as any,
    );
  }

  createReadOnlyFeed(feedKey: FeedKey, partyKey: PartyKey): Promise<Feed> {
    assert(partyKey instanceof Uint8Array || Buffer.isBuffer(partyKey));
    return this._feedStore.openFeed(
      keyToString(randomBytes()),
      { key: Buffer.from(feedKey), metadata: { partyKey } } as any,
    );
  }

  // TODO(marik-d): Should probably not be here
  enumerateParties (): PartyKey[] {
    return Array.from(new Set(
      this._feedStore.getDescriptors()
        .map(descriptor => descriptor.metadata.partyKey)
        .filter(Boolean)
    ).values());
  }
}
