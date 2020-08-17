//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import { Readable } from 'stream';

import { FeedStore, FeedDescriptor, createBatchStream } from '@dxos/feed-store';

import { createReadable, Trigger } from '../util';
import { FeedKey, IFeedBlock } from './types';

const log = debug('dxos:echo:feed-store-iterator');

/**
 * Creates an ordered stream.
 *
 * @param feedStore
 * @param feedSelector - Returns true if the feed should be considered.
 * @param messageSelector - Returns the index of the selected message candidate (or undefined).
 */
export async function createOrderedFeedStream (
  feedStore: FeedStore,
  feedSelector: (feedKey: FeedKey) => Promise<boolean>, // TODO(burdon): Why async?
  messageSelector: (candidates: IFeedBlock[]) => number | undefined = () => 0
) {
  if (feedStore.closing || feedStore.closed) {
    throw new Error('FeedStore closed');
  }

  if (!feedStore.opened) {
    await feedStore.ready();
  }

  const iterator = new FeedStoreIterator(feedSelector, messageSelector);

  // TODO(burdon): Move into iteratore.initialize() instead of private methods here.
  const initialDescriptors = feedStore.getDescriptors().filter(descriptor => descriptor.opened);
  for (const descriptor of initialDescriptors) {
    iterator.addFeedDescriptor(descriptor);
  }

  // Subscribe to new feeds.
  // TODO(burdon): Need to test belongs to party.
  (feedStore as any).on('feed', (_: never, descriptor: FeedDescriptor) => {
    iterator.addFeedDescriptor(descriptor);
  });

  const readStream = createReadable<IFeedBlock>();
  setImmediate(async () => {
    for await (const message of iterator) {
      readStream.push(message);
    }
  });

  return { readStream, iterator };
}

/**
 * We are using an iterator here instead of a stream to ensure we have full control over how and at what time
 * data is read. This allows the consumer (e.g., PartyProcessor) to control the order in which data is generated.
 * (Streams would not be suitable since NodeJS streams have intenal buffer that the system tends to eagerly fill.)
 */
class FeedStoreIterator implements AsyncIterable<IFeedBlock> {
  /** Curent set of active feeds. */
  private readonly _candidateFeeds = new Set<FeedDescriptor>();

  /** Feed key as hex => feed state */
  private readonly _openFeeds = new Map<string, {
    descriptor: FeedDescriptor,
    iterator: AsyncIterator<IFeedBlock[]>,
    sendQueue: IFeedBlock[], // TODO(burdon): Why "send"?
    frozen: boolean,
  }>();

  private readonly _trigger = new Trigger();
  private readonly _generatorInstance = this._generator();

  private readonly _feedSelector: (feedKey: FeedKey) => Promise<boolean>;
  private readonly _messageSelector: (candidates: IFeedBlock[]) => number | undefined;

  // Needed for round-robin ordering.
  private _messageCount = 0;

  private _destroyed = false;

  constructor (
    feedSelector: (feedKey: FeedKey) => Promise<boolean>,
    messageSelector: (candidates: IFeedBlock[]) => number | undefined
  ) {
    assert(feedSelector);
    assert(messageSelector);
    this._feedSelector = feedSelector;
    this._messageSelector = messageSelector;
  }

  /**
   * Adds a feed to be consumed.
   * @param descriptor
   */
  addFeedDescriptor (descriptor: FeedDescriptor) {
    this._candidateFeeds.add(descriptor);
    this._trigger.wake();
  }

  // TODO(burdon): Hack/rename.
  tickle () {
    this._trigger.wake();
  }

  // TODO(burdon): Close?
  // TODO(marik-d): Does this need to close the streams, or will they be garbage-collected automatically?
  destroy () {
    this._destroyed = true;
    this._trigger.wake();
  }

  /**
   * This gets called by `for await` loop to get the iterator instance that's then polled on each loop iteration.
   * We return a singleton here to ensure that the `_generator` function only gets called once.
   */
  [Symbol.asyncIterator] () {
    return this._generatorInstance;
  }

  // TODO(burdon): Comment.
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

  // TODO(burdon): Comment.
  private _popSendQueue () {
    const openFeeds = Array.from(this._openFeeds.values());
    const candidates = openFeeds
      .filter(feed => !feed.frozen && feed.sendQueue.length > 0)
      .map(feed => feed.sendQueue[0]);

    if (candidates.length === 0) {
      return undefined;
    }

    const selected = this._messageSelector(candidates);
    if (selected === undefined) {
      return;
    }

    const pickedCandidate = candidates[selected];
    const feed = this._openFeeds.get(pickedCandidate.key.toString('hex'));
    assert(feed);

    return feed.sendQueue.shift();
  }

  // TODO(burdon): Comment.
  private _pollFeeds () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, feed] of this._openFeeds) {
      if (feed.sendQueue.length === 0) {
        // TODO(burdon): then/catch?
        feed.iterator.next()
          .then(result => {
            assert(!result.done);
            feed.sendQueue.push(...result.value);
            this._trigger.wake();
          }, console.error); // TODO(marik-d): Proper error handling.
      }
    }
  }

  // TODO(burdon): Comment.
  private async _waitForData () {
    this._pollFeeds();

    await this._trigger.wait();

    log('Ready');
    this._trigger.reset(); // TODO(burdon): Reset atomically?
  }

  // TODO(burdon): Comment.
  async * _generator () {
    while (!this._destroyed) {
      while (true) {
        await this._reevaluateFeeds();

        // TODO(burdon): This always seems to be undefined.
        const message = this._popSendQueue();
        if (message === undefined) {
          log('Paused...');
          break;
        }

        this._messageCount++;

        // TODO(burdon): Add feedKey (FeedMessage)?
        yield message;
      }

      await this._waitForData();
    }
  }
}
