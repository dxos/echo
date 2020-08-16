//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import merge from 'lodash/merge';
import { pipeline, Readable, Transform, Writable } from 'stream';

import { keyToString } from '@dxos/crypto';
import { FeedStore } from '@dxos/feed-store';

import { dxos } from '../proto/gen/testing';

import { createFeedMeta, createWritableFeedStream, IFeedBlock } from '../feeds';
import { IEchoStream } from '../items';
import { createTransform } from '../util';
import { FeedKeyMapper, Spacetime } from '../spacetime';
import { PartyKey } from './types';

interface Options {
  readLogger?: Transform;
  writeLogger?: Transform;
}

const log = debug('dxos:echo:party-streams');

const spacetime = new Spacetime(new FeedKeyMapper('feedKey'));

/**
 * Manages the inbound and outbound message pipelines for each party.
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
  async open (): Promise<{ readStream: NodeJS.ReadableStream, writeStream: NodeJS.WritableStream }> {
    // Current timeframe.
    let timeframe = spacetime.createTimeframe();

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

      // Update timeframe.
      const { key, seq } = block;
      timeframe = spacetime.merge(timeframe, spacetime.createTimeframe([[key as any, seq]]));

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
        const data: dxos.echo.testing.IFeedMessage = {
          echo: message
        };

        return data;
      });

    //
    // Add Timeframe to outbound messages.
    //
    const timeframeTransform = createTransform<dxos.echo.testing.IEchoEnvelope, dxos.echo.testing.IEchoEnvelope>(
      async (message: dxos.echo.testing.IEchoEnvelope) => {
        return merge(message, {
          echo: {
            timeframe
          }
        });
      }
    );

    //
    // Create inbound and outbound pipielines.
    // https://nodejs.org/api/stream.html#stream_stream_pipeline_source_transforms_destination_callback
    //

    const { readLogger, writeLogger } = this._options;

    // TODO(burdon): Filter feeds and select messages by Timeframe (via iterator).
    const inbound = this._feedStore.createReadStream({ live: true });
    pipeline([inbound, readLogger, this._readStream].filter(Boolean), (err) => {
      // TODO(burdon): Handle error.
      log(err || 'Inbound pipieline closed.');
    });

    const feed = await this._feedStore.openFeed(keyToString(this._partyKey));
    const outbound = createWritableFeedStream(feed);
    pipeline([this._writeStream, timeframeTransform, writeLogger, outbound].filter(Boolean) as any[], (err) => {
      // TODO(burdon): Handle error.
      log(err || 'Outbound pipeline closed.');
    });

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
