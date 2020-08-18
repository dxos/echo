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
import { jsonReplacer } from '../proto';
import { FeedKeyMapper, Spacetime } from '../spacetime';
import { createTransform } from '../util';
import { PartyProcessor } from './party-processor';

interface Options {
  readLogger?: Transform;
  writeLogger?: Transform;
}

const log = debug('dxos:echo:pipeline');

const spacetime = new Spacetime(new FeedKeyMapper('feedKey'));

/**
 * Manages the inbound and outbound message pipelines for an individual party.
 */
export class Pipeline {
  private readonly _feedStore: FeedStore;
  private readonly _partyProcessor: PartyProcessor;
  private readonly _options: Options;

  // Messages to be consumed from pipeline (e.g., mutations to model).
  private _readStream: Readable | undefined;

  // Messages to write into pipeline (e.g., mutations from model).
  private _writeStream: Writable | undefined;

  // TODO(burdon): Replace feed-store with feed-store-iterator.
  constructor (feedStore: FeedStore, partyProcessor: PartyProcessor, options?: Options) {
    assert(feedStore);
    assert(partyProcessor);
    this._feedStore = feedStore;
    this._partyProcessor = partyProcessor;
    this._options = options || {};
  }

  get partyKey () {
    return this._partyProcessor.partyKey;
  }

  get isOpen () {
    return this._readStream !== undefined;
  }

  get readonly () {
    return this._writeStream === undefined;
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
  async open (): Promise<[NodeJS.ReadableStream, NodeJS.WritableStream]> {
    // Current timeframe.
    let timeframe = spacetime.createTimeframe();

    //
    // Processes inbound messages (piped from feed store).
    //
    this._readStream = createTransform<IFeedBlock, IEchoStream>(async (block: IFeedBlock) => {
      const { data: message } = block;

      // TODO(burdon): Inject party processor to manage admitted feeds.
      if (message.halo) {
        await this._partyProcessor.processMessage({
          meta: createFeedMeta(block),
          data: message.halo
        });
      }

      // Update timeframe.
      // NOTE: It is OK to update here even though the message may not have been processed,
      // since any paused dependent message must be intended for this stream.
      const { key, seq } = block;
      timeframe = spacetime.merge(timeframe, spacetime.createTimeframe([[key as any, seq]]));

      if (message.echo) {
        // Validate messge.
        const { itemId } = message.echo;
        if (itemId) {
          return {
            meta: createFeedMeta(block),
            data: message.echo
          };
        }
      }

      // TODO(burdon): Can we throw and have the pipeline log (without breaking the stream).
      log(`Skipping invalid message: ${JSON.stringify(message, jsonReplacer)}`);
    });

    //
    // Processes outbound messages (piped to feed store).
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

    // Read message from feed-store.
    const feedReadStream = this._feedStore.createReadStream({ live: true });

    // Write messages to feed-store.
    const feed = await this._feedStore.openFeed(keyToString(this.partyKey));
    const feedWriteStream = createWritableFeedStream(feed);

    const { readLogger, writeLogger } = this._options;

    pipeline([feedReadStream, readLogger, this._readStream].filter(Boolean), (err) => {
      // TODO(burdon): Handle error.
      log(err || 'Inbound pipieline closed.');
    });

    pipeline([this._writeStream, timeframeTransform, writeLogger, feedWriteStream].filter(Boolean) as any[], (err) => {
      // TODO(burdon): Handle error.
      log(err || 'Outbound pipeline closed.');
    });

    return [
      this._readStream,
      this._writeStream
    ];
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
      this._feedStore.closeFeed(keyToString(this.partyKey));
      this._writeStream.destroy();
      this._writeStream = undefined;
    }
  }
}
