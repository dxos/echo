//
// Copyright 2020 DxOS.org
//

import debug from 'debug';
import { EventEmitter } from 'events';

import { createId } from '@dxos/crypto';

import {
  Anchor, AnchoredMountPoint, AnchoredReadableSource, AnchoredWriteableSink, AppendedMessage,
  EchoMessage, PartyFeeds, ReadablePartyFeed, WritablePartyFeed
} from '../echo-feeds';
import { Order, LogicalClock, LogicalClockStamp } from '../consistency';

const log = debug('dxos:echo:testnetwork');

type TestMessage = EchoMessage;

const syncFeed = async (fromFeed: TestFeed, toFeed: TestFeed): Promise<void> => {
  toFeed.messages.push(...fromFeed.messages.slice(toFeed.seq, fromFeed.seq));
  toFeed.seq = fromFeed.seq;
};

interface AnchorWaiter {
    waitingFor: Anchor,
    resolveFunction: any,
    rejectFunction: any
}

class TestAnchor implements Anchor {
    // TODO(dboreham): Rewrite to make this private.
    vector: Map<Buffer, number> = new Map();

    toBuffer (): Buffer {
      return Buffer.from('implement_me');
    }

    static fromFeeds (feeds: TestFeed[]): TestAnchor {
      const anchor = new TestAnchor();
      feeds.forEach(feed => anchor.vector.set(feed.id, feed.seq));
      return anchor;
    }

    _toLogicalClockStamp (): LogicalClockStamp {
      const result = new LogicalClockStamp();
      result._setVector(this.vector);
      return result;
    }

    log (): string {
      return Array.from(this.vector.entries()).map(([key, value]) => `${key.toString('hex')}:${value}`).join(', ');
    }
}

class TestFeed {
    id: Buffer;
    seq: number = 0;
    messages: TestMessage[] = [];

    constructor (id: Buffer) {
      this.id = id;
    }

    getKey (): Buffer {
      return this.id;
    }

    getSeq (): number {
      return this.seq;
    }

    async append (message: TestMessage): Promise<void> {
      this.messages.push(message);
      this.seq++;
    }
}

class TestAnchoredWriteableSink implements AnchoredWriteableSink {
    private node: TestPartyNode;

    constructor (node: TestPartyNode) {
      this.node = node;
    }

    async append (messages: AppendedMessage[]): Promise<Anchor> {
      for await (const message of messages) {
        // TODO(dboreham): Implement me -- add the lcs here
        const echoMessage = { lcs: this.node._getCurrentClockStamp().toObject(), data: { ...message } };
        log(`sink.append: ${JSON.stringify(echoMessage)}`);
        await this.node._getWriteFeed().append(echoMessage);
        // Copy to our read feed for the local write feed.
        await this.node._copyWriteFeedtoReadFeed();
      }
      // TODO(dboreham): Verify that the append() call above returns after the anchor has moved.
      return TestAnchor.fromFeeds(this.node._getReadFeeds());
    }

    getAnchor (): Anchor {
      return TestAnchor.fromFeeds(this.node._getReadFeeds());
    }
}

class TestAnchoredReadableSource extends AnchoredReadableSource {
    private node: TestPartyNode;
    private lcs: LogicalClockStamp;
    private waiters: AnchorWaiter[];

    constructor (node: TestPartyNode) {
      super();
      this.node = node;
      this.lcs = LogicalClockStamp.zero();
      this.waiters = [];
    }

    getAnchor (): Anchor {
      return TestAnchor.fromFeeds(this.node._getReadFeeds());
    }

    async waitForAnchor (anchor: Anchor): Promise<void> {
      log(`waiting for: ${anchor.log()}, current: ${this.lcs.log()}`);
      const readyPromise = new Promise<void>((resolve, reject) => {
        // Check if we're already past the wait anchor.
        // TODO(dboreham): Fold with same code below.
        if (LogicalClockStamp.compare((anchor as TestAnchor)._toLogicalClockStamp(), this.lcs) === Order.AFTER) {
          log('short wait');
          resolve();
        } else {
          // Add to the list of waiters
          this.waiters.push({
            waitingFor: anchor,
            resolveFunction: resolve,
            rejectFunction: reject
          });
        }
        // TODO(dboreham): Leak if no resolve.
      });
      return readyPromise;
    }

    // TODO(dboreham): Bad name.
    async _onNewData (): Promise<void> {
      // Get the messages that are new vs our previous anchor/lcs
      const messages: EchoMessage[] = [];
      const highestLcsSeen = this.lcs;
      this.node._getReadFeeds().forEach((readFeed) => {
        messages.push(...readFeed.messages.slice(this.lcs._getSeqForNode(readFeed.id), readFeed.seq));
        highestLcsSeen._setSeqForNode(readFeed.id, readFeed.seq);
      });
      // TODO(dboreham): Sort into causal order
      // Setting our lcs must be done synchronously with event delivery below:
      this.lcs = highestLcsSeen;
      log(`source.data ${JSON.stringify(messages)}`);
      // Send payload to our listener.
      this.emit('data', messages);
      this.waiters.forEach((waiter) => {
        if (LogicalClockStamp.compare((waiter.waitingFor as TestAnchor)._toLogicalClockStamp(), this.lcs) === Order.AFTER) {
          waiter.resolveFunction();
        }
      });
    }
}

class TestAnchoredMountPoint {
    private source: AnchoredReadableSource;
    private sink: AnchoredWriteableSink;

    constructor (source: AnchoredReadableSource, sink: AnchoredWriteableSink) {
      this.source = source;
      this.sink = sink;
    }

    getSink (): AnchoredWriteableSink {
      return this.sink;
    }

    getSource (): AnchoredReadableSource {
      return this.source;
    }
}

export class TestPartyNetwork {
    nodeCount: number;
    nodes: TestPartyNode[];

    constructor (nodeCount: number) {
      this.nodeCount = nodeCount;
      this.nodes = [];
      const nodeFeedIds: Buffer[] = [];
      for (let i = 0; i < this.nodeCount; i++) {
        nodeFeedIds.push(createId());
      }
      for (let i = 0; i < this.nodeCount; i++) {
        this.nodes.push(new TestPartyNode(this.nodeCount, i, nodeFeedIds));
      }
    }

    getNode (nodeIndex: number): TestPartyNode {
      return this.nodes[nodeIndex];
    }

    async replicate (fromNodeIndex: number, toNodeIndex: number) : Promise<void> {
      const fromFeed = this.nodes[fromNodeIndex]._getWriteFeed();
      this.nodes.forEach((node) => {
        const toFeed = node._getReadFeed(toNodeIndex);
        toFeed.messages.push(...fromFeed.messages.slice(toFeed.seq, fromFeed.seq));
        toFeed.seq = fromFeed.seq;
      });
    }

    async replicateAll () : Promise<void> {
      for (let i = 0; i < this.nodeCount; i++) {
        for (let j = 0; j < this.nodeCount; j++) {
          await this.replicate(i, j);
        }
      }
    }
}

class TestPartyFeeds implements PartyFeeds {
    private node: TestPartyNode;

    constructor (node: TestPartyNode) {
      this.node = node;
    }

    getFeeds (): ReadablePartyFeed[] {
      // TODO(dboreham): Add event emitter for feed set updates.
      return this.node._getReadFeeds() as unknown as ReadablePartyFeed[];
    }

    getWritableFeed (): WritablePartyFeed {
      // TODO(dboreham): Hack.
      return undefined as unknown as WritablePartyFeed;
    }
}

export class TestPartyNode extends EventEmitter {
    private nodeIndex: number;
    private writeFeed : TestFeed;
    // readFeeds includes a readable copy of our write feed, to avoid the need to special case the local feed.
    private readFeeds : TestFeed[];
    private sources: TestAnchoredReadableSource[];
    private sinks: TestAnchoredWriteableSink[];
    private logicalClock: LogicalClock;

    constructor (nodeCount:number, nodeIndex: number, nodeFeedIds: Buffer[]) {
      super();
      this.nodeIndex = nodeIndex;
      this.readFeeds = [];
      this.sources = [];
      this.sinks = [];
      this.writeFeed = new TestFeed(nodeFeedIds[nodeIndex]);
      for (let i = 0; i < nodeCount; i++) {
        this.readFeeds.push(new TestFeed(nodeFeedIds[i]));
      }
      this.logicalClock = new LogicalClock(new TestPartyFeeds(this));
      this.on('_update', async () => {
        await this.onFeedsUpdated();
      });
    }

    getMountPoint (): AnchoredMountPoint {
      const source = new TestAnchoredReadableSource(this);
      this.sources.push(source);
      const sink = new TestAnchoredWriteableSink(this);
      this.sinks.push(sink);
      return new TestAnchoredMountPoint(source, sink);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async waitForAnchor (anchor: Anchor): Promise<void> {
      // TODO(dboreham): Implement.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const readyPromise = new Promise<void>((resolve, reject) => {
        // Add to the list of callbacks
      });
      return readyPromise;
    }

    // Package private methods.

    _getReadFeed (nodeIndex: number): TestFeed {
      return this.readFeeds[nodeIndex];
    }

    _getReadFeeds (): TestFeed[] {
      return this.readFeeds;
    }

    _getWriteFeed (): TestFeed {
      return this.writeFeed;
    }

    async _copyWriteFeedtoReadFeed (): Promise<void> {
      await syncFeed(this.writeFeed, this.readFeeds[this.nodeIndex]);
      this.emit('_update');
    }

    _getCurrentClockStamp (): LogicalClockStamp {
      return this.logicalClock.getCurrentStamp();
    }

    // Private methods.

    private async onFeedsUpdated (): Promise<void> {
      this.sources.map((source) => { source._onNewData(); });
    }
}
