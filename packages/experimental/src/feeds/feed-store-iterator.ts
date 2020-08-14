//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import { Readable } from 'stream';

import { FeedStore, FeedDescriptor, createBatchStream } from '@dxos/feed-store';

import { Trigger } from '../util';
import { FeedKey, IFeedBlock } from './types';

/**
 * We are using an iterator here instead of a stream to ensure we have full control over how and at what time
 * data is read. This allows the consumer (e.g., PartyProcessor) to control the order in which data is generated.
 * (Streams would not be suitable since NodeJS streams have intenal buffer that the system tends to eagerly fill.)
 */
export class FeedStoreIterator implements AsyncIterable<IFeedBlock> {
  // TODO(burdon): Export function.
  static async create (
    feedStore: FeedStore,
    feedSelector: (feedKey: FeedKey) => Promise<boolean>,
    messageOrderer: (candidates: IFeedBlock[]) => number | undefined = () => 0
  ) {
    if (feedStore.closing || feedStore.closed) {
      throw new Error('FeedStore closed');
    }

    if (!feedStore.opened) {
      await feedStore.ready();
    }

    const iterator = new FeedStoreIterator(feedSelector, messageOrderer);

    const initialDescriptors = feedStore.getDescriptors().filter(descriptor => descriptor.opened);
    for (const descriptor of initialDescriptors) {
      iterator._trackDescriptor(descriptor);
    }

    // Subscribe to new feeds.
    // TODO(burdon): Need to test belongs to party.
    (feedStore as any).on('feed', (_: never, descriptor: FeedDescriptor) => {
      iterator._trackDescriptor(descriptor);
    });

    return iterator;
  }

  private readonly _candidateFeeds = new Set<FeedDescriptor>();

  /** Feed key as hex => feed state */
  private readonly _openFeeds = new Map<string, {
    descriptor: FeedDescriptor,
    iterator: AsyncIterator<IFeedBlock[]>,
    frozen: boolean,
    sendQueue: IFeedBlock[]
  }>();

  private readonly _trigger = new Trigger();
  private _messageCount = 0; // Needed for round-robin ordering.
  private _destroyed = false;

  constructor (
    private readonly _feedSelector: (feedKey: FeedKey) => Promise<boolean>,
    private readonly _messageOrderer: (candidates: IFeedBlock[]) => number | undefined
  ) {}

  private async _reevaluateFeeds () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [keyHex, feed] of this._openFeeds) {
      if (!await this._feedSelector(feed.descriptor.key)) {
        feed.frozen = true;
      }
    }

    // Get candidate snapshot since we will be mutating the collection.
    for (const descriptor of Array.from(this._candidateFeeds.values())) {
      if (await this._feedSelector(descriptor.key)) {
        const stream = new Readable({ objectMode: true })
          .wrap(createBatchStream(descriptor.feed, { live: true }));

        this._openFeeds.set(descriptor.key.toString('hex'), {
          descriptor,
          iterator: stream[Symbol.asyncIterator](),
          frozen: false,
          sendQueue: []
        });

        this._candidateFeeds.delete(descriptor);
      }
    }
  }

  private _popSendQueue () {
    const openFeeds = Array.from(this._openFeeds.values());
    const candidates = openFeeds
      .filter(feed => !feed.frozen && feed.sendQueue.length > 0)
      .map(feed => feed.sendQueue[0]);

    if (candidates.length === 0) {
      return undefined;
    }

    const selected = this._messageOrderer(candidates);
    if (selected === undefined) {
      return undefined;
    }

    const pickedCandidate = candidates[selected];
    const feed = this._openFeeds.get(pickedCandidate.key.toString('hex'));
    assert(feed);

    return feed.sendQueue.shift();
  }

  private _pollFeeds () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [keyHex, feed] of this._openFeeds) {
      if (feed.sendQueue.length === 0) {
        feed.iterator.next().then(
          result => {
            assert(!result.done);
            feed.sendQueue.push(...result.value);
            this._trigger.wake();
          },
          console.error // TODO(marik-d): Proper error handling
        );
      }
    }
  }

  private async _waitForData () {
    this._pollFeeds();
    await this._trigger.wait();
    this._trigger.reset();
  }

  async * _generator () {
    while (!this._destroyed) {
      while (true) {
        await this._reevaluateFeeds();

        const message = this._popSendQueue();
        if (!message) { break; }
        this._messageCount++;

        // TODO(burdon): Add feedKey (FeedMessage)?
        yield message;
      }

      await this._waitForData();
    }
  }

  private _generatorInstance = this._generator();

  /**
   * This gets called by "for await" loop to get the iterator instance that's then polled on each loop iteration.
   * We return a singleton here to ensure that the `_generator` function only gets called once.
   */
  [Symbol.asyncIterator] () {
    return this._generatorInstance;
  }

  private _trackDescriptor (descriptor: FeedDescriptor) {
    this._candidateFeeds.add(descriptor);
    this._trigger.wake();
  }

  // TODO(marik-d): Does this need to close the streams, or will they be garbage-collected automatically?
  destory () {
    this._destroyed = true;
    this._trigger.wake();
  }
}
