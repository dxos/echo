//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import { Readable, Transform, Writable } from 'stream';

import { keyToString } from '@dxos/crypto';
import { FeedStore } from '@dxos/feed-store';

import { dxos } from '../proto/gen/testing';

import { createFeedMeta, createWritableFeedStream, IFeedBlock } from '../feeds';
import { IEchoStream } from '../items';
import { createTransform } from '../util';
import { PartyKey } from './types';

interface Options {
  readLogger?: Transform;
  writeLogger?: Transform;
}

/**
 * Manages FeedStore I/O for a specific party.
 */
export class PartyStreams {
  private readonly _feedStore: FeedStore;
  private readonly _partyKey: PartyKey;
  private readonly _options: Options;

  private _readStream: Readable | undefined;
  private _writeStream: Writable | undefined;

  constructor (feedStore: FeedStore, partyKey: PartyKey, options?: Options) {
    assert(feedStore);
    assert(partyKey);
    this._feedStore = feedStore;
    this._partyKey = partyKey;
    this._options = options || {};
  }

  get key () {
    return this._partyKey;
  }

  get isReadable () {
    return this._readStream !== undefined;
  }

  get isWriteable () {
    return this._writeStream !== undefined;
  }

  get readStream () {
    return this._readStream;
  }

  get writeStream () {
    return this._writeStream;
  }

  /**
   * Open streams and connect to pipelines:
   *
   * Feed
   *   Transform(IFeedBlock => IEchoStream): Party processing (clock ordering)
   *     ItemDemuxer
   *       Transform(dxos.echo.testing.IEchoEnvelope => dxos.echo.testing.IFeedMessage): update clock
   *         Feed
   */
  // TODO(burdon): Factor out transforms.
  async open (): Promise<{ readStream: NodeJS.ReadableStream, writeStream: NodeJS.WritableStream }> {
    //
    // Create readable stream from set of party feeds.
    //

    this._readStream = createTransform<IFeedBlock, IEchoStream>(async (block: IFeedBlock) => {
      // TODO(burdon): Which key is this?
      // assert(block.key === this.key);
      const { data } = block;

      // TODO(burdon): Inject party processor.
      if (data.halo) {
        return;
      }

      // TODO(burdon): Order by vector clock.
      if (data.echo) {
        return {
          meta: createFeedMeta(block),
          data: data.echo
        };
      }

      throw new Error(`Invalid block: ${JSON.stringify(block)}`);
    });

    //
    // Create writable stream to party's feed.
    //

    this._writeStream = createTransform<dxos.echo.testing.IEchoEnvelope, dxos.echo.testing.IFeedMessage>(
      async (message: dxos.echo.testing.IEchoEnvelope) => {
        // TODO(burdon): Set clock.
        const data: dxos.echo.testing.IFeedMessage = {
          echo: message
        };

        return data;
      });

    //
    // Conncet pipieline.
    //

    const { readLogger, writeLogger } = this._options;

    // TODO(burdon): Use `pipeline`?
    // pipeline(this._readStream, readLogger, this._feedStore.createReadStream({ live: true }), () => {
    //   console.log('!!!!!!!!!!!!!!!!!!!!');
    // });

    // TODO(burdon): Filter and order via iterator.
    const feedStream = this._feedStore.createReadStream({ live: true });
    if (readLogger) {
      feedStream.pipe(readLogger).pipe(this._readStream);
    } else {
      feedStream.pipe(this._readStream);
    }

    const feed = await this._feedStore.openFeed(keyToString(this._partyKey));
    if (writeLogger) {
      this._writeStream.pipe(writeLogger).pipe(createWritableFeedStream(feed));
    } else {
      this._writeStream.pipe(createWritableFeedStream(feed));
    }

    return {
      readStream: this._readStream,
      writeStream: this._writeStream
    };
  }

  /**
   * Close all streams.
   */
  // TODO(burdon): Does destroy automatically close downstream pipelines? Check close/end events.
  async close () {
    if (this._readStream) {
      this._readStream.destroy();
      this._readStream = undefined;
    }

    if (this._writeStream) {
      this._feedStore.closeFeed(keyToString(this._partyKey));
      this._writeStream.destroy();
      this._writeStream = undefined;
    }
  }
}
