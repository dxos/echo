//
// Copyright 2020 DxOS.org
//

import { EventEmitter } from 'events';
import { LogicalClock } from './consistency';

// Interfaces

// TODO(dboreham): Sort out where this goes so we all agree on what a message is.
export interface AppendedMessage {
    // eslint-disable-next-line
    __type_url: string
    // Payload props?
}

// TODO(dboreham): Sort out where this goes so we all agree on what a message is.
export interface EchoMessage {
    lcs: object,
    data: object
}

type FeedSequenceNumber = number;

// TODO(dboreham) Find the real Key
type Key = Buffer;
// TODO(dboreham): Does it work to use Buffer as a Map key?
type FeedId = Key;

// Interface from party-manager to echo

// TODO(dboreham): Need to define an abstraction for Feed, and concrete FeedStoreFeed, MockFeed implementations.
export abstract class PartyFeed {
    abstract getKey(): Key;
    abstract getSeq(): FeedSequenceNumber;
}

export abstract class WritablePartyFeed extends PartyFeed {
    abstract async append(message: EchoMessage): Promise<Anchor>;
    abstract getSeq(): FeedSequenceNumber;
}

export abstract class ReadablePartyFeed extends EventEmitter implements PartyFeed {
    abstract getKey(): Key;
    abstract getSeq(): FeedSequenceNumber;
    // on('data', (messages: EchoMessage[], metadata?) => {})
}

export abstract class PartyFeeds {
    abstract getWritableFeed(): WritablePartyFeed;
    abstract getFeeds(): ReadablePartyFeed[];
    // on('update', () => {} ) : re-fetch updated feeds via getFeeds()
}

// Interface from echo to echo-model

export abstract class Anchor {
    abstract toBuffer(): Buffer;
    abstract log(): string;
}

export abstract class AnchoredWriteableSink {
    abstract getAnchor() : Anchor;
    abstract async append(messages: AppendedMessage[]) : Promise<Anchor>
}

export abstract class AnchoredReadableSource extends EventEmitter {
    abstract getAnchor() : Anchor;
    abstract async waitForAnchor (anchor: Anchor): Promise<void>;
    // on('data', (messages: EchoMessage[], anchor: Anchor) => {})
}

export abstract class AnchoredMountPoint {
    abstract getSource(): AnchoredReadableSource;
    abstract getSink(): AnchoredWriteableSink;
}

// Implementation

class EchoAnchor implements Anchor {
    private vector: Map<FeedId, FeedSequenceNumber>;

    constructor () {
      this.vector = new Map();
    }

    toBuffer (): Buffer {
      return Buffer.from('implement_me');
    }

    log (): string {
      return Array.from(this.vector.entries()).map(([key, value]) => `${key.toString('hex')}:${value}`).join(', ');
    }
}

export class EchoAnchoredWriteableSink implements AnchoredWriteableSink {
    private feed: WritablePartyFeed;
    private logicalClock: LogicalClock;

    // TODO(dboreham): change to real party write feed type.
    constructor (partyFeeds: PartyFeeds, logicalClock: LogicalClock) {
      this.feed = partyFeeds.getWritableFeed();
      this.logicalClock = logicalClock;
    }

    getAnchor (): Anchor {
      return new EchoAnchor();
    }

    async append (messages: AppendedMessage[]): Promise<Anchor> {
      let anchor: EchoAnchor|undefined;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for await (const message of messages) {
        // Add the logical clock stamp here.
        // TODO(dboreham): Implement
        const echoMessage = { lcs: this.logicalClock.getCurrentStamp(), data: {} } as EchoMessage;
        // TODO(dboreham): casting weird, fix
        anchor = await this.feed.append(echoMessage) as EchoAnchor;
      }
      return anchor as Anchor;
    }
}

export class EchoAnchoredReadableSource extends EventEmitter implements AnchoredReadableSource {
  getAnchor (): Anchor {
    return new EchoAnchor();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async waitForAnchor (anchor: Anchor): Promise<void> {
    return Promise.resolve(undefined);
  }
}
