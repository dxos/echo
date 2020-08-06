import { FeedStore, FeedDescriptor } from '@dxos/feed-store';
import { Readable } from 'stream';
import { Feed } from 'hypercore';
import { trigger } from '@dxos/async';
import assert from 'assert';

export class FeedStoreLens implements AsyncIterable<any> {
  static async create (feedStore: FeedStore, feedSelector: (feedKey: Buffer) => Promise<boolean>) {
    if (feedStore.closing || feedStore.closed) {
      throw new Error('FeedStore closed');
    }
    if (!feedStore.opened) {
      await feedStore.ready();
    }

    const existingDescriptors = feedStore.getDescriptors().filter(descriptor => descriptor.opened);

    const lens = new FeedStoreLens(feedSelector);
    for (const descriptor of existingDescriptors) {
      lens._trackDescriptor(descriptor);
    }
    (feedStore as any).on('feed', (_: never, descriptor: FeedDescriptor) => {
      lens._trackDescriptor(descriptor);
    });

    return lens;
  }

  private readonly _candidateFeeds = new Set<FeedDescriptor>();
  private readonly _openFeeds = new Set<{ descriptor: FeedDescriptor, iterator: AsyncIterator<any>, frozen: boolean, sendQueue: any[] }>();
  private _messageCount = 0; // needed for round-robin ordering
  private _destoryed = false;

  constructor (
    private readonly _feedSelector: (feedKey: Buffer) => Promise<boolean>
  ) {
    this._resetWakeTrigger();
  }

  private async _reevaluateFeeds () {
    for (const feed of this._openFeeds) {
      if (!await this._feedSelector(feed.descriptor.key)) {
        feed.frozen = true;
      }
    }
    for (const descriptor of Array.from(this._candidateFeeds.values())) { // snapshot cause we will be mutating the collection
      if (await this._feedSelector(descriptor.key)) {
        const stream = new Readable({ objectMode: true }).wrap((descriptor.feed as Feed).createReadStream({ live: true }));
        this._openFeeds.add({
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
    for (let i = 0; i < openFeeds.length; i++) {
      const idx = (this._messageCount + i) % openFeeds.length; // round-robin
      if (openFeeds[idx].frozen) { continue; }
      if (openFeeds[idx].sendQueue.length === 0) { continue; }
      return openFeeds[idx].sendQueue.shift();
    }
    return undefined;
  }

  _promise!: Promise<void>;
  _wake!: (() => void);
  private async _resetWakeTrigger () {
    const [getPromise, resolve] = trigger();
    this._promise = getPromise();
    this._wake = resolve;
  }

  private async _waitForData () {
    for (const feed of this._openFeeds) {
      feed.iterator.next().then(
        result => {
          assert(!result.done);
          feed.sendQueue.push(result.value);
          this._wake?.();
        },
        console.error // TODO(marik-d): Proper error handling
      );
    }

    await this._promise;
    this._resetWakeTrigger();
  }

  async * _generator () {
    while (!this._destoryed) {
      while (true) {
        await this._reevaluateFeeds();

        const message = this._popSendQueue();
        if (!message) { break; }
        this._messageCount++;
        yield message;
      }

      await this._waitForData();
    }
  }

  private _generatorInstance = this._generator();
  [Symbol.asyncIterator] () {
    return this._generatorInstance;
  }

  private _trackDescriptor (descriptor: FeedDescriptor) {
    this._candidateFeeds.add(descriptor);
    this._wake?.();
  }

  destory () {
    this._destoryed = true;
    this._wake?.();
    // TODO(marik-d): Does this need to close the streams, or will they be garbage-collected automatically?
  }
}
