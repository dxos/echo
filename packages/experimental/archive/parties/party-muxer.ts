//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import { Readable } from 'stream';

import { keyToString } from '@dxos/crypto';
import { FeedStore } from '@dxos/feed-store';

import { dxos } from '../../src/proto/gen/testing';

import { LogicalClockStamp, Order } from '../clock';
import { FeedStoreIterator } from '../pipeline';
import { FeedKey } from '../../src/types';
import { assumeType } from '../../src/util';

const log = debug('dxos:echo:party');

/**
 * Reads party feeds and routes to items demuxer.
 * @param feedStore
 * @param [initialFeeds]
 * @param [initialAnchor] TODO(burdon): Emit event when anchor point reached?
 */
export const createPartyMuxer = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  feedStore: FeedStore, initialFeeds: FeedKey[], initialAnchor?: dxos.echo.testing.IVectorTimestamp
) => {
  // TODO(burdon): Is this the correct way to create a stream?
  const outputStream = new Readable({ objectMode: true, read () {} });

  // Configure iterator with dynamic set of admitted feeds.
  const allowedFeeds: Set<string> = new Set(initialFeeds.map(feedKey => keyToString(feedKey)));

  let currentTimestamp = new LogicalClockStamp();

  // TODO(burdon): Explain control.
  setImmediate(async () => {
    const iterator = await FeedStoreIterator.create(feedStore,
      async feedKey => allowedFeeds.has(keyToString(feedKey)),
      candidates => {
        for (let i = 0; i < candidates.length; i++) {
          const { data: { payload } } = candidates[i];
          if (message.__type_url === 'dxos.echo.testing.ItemEnvelope') {
            assumeType<dxos.echo.testing.IItemEnvelope>(message);
            const timestamp = message.timestamp ? LogicalClockStamp.decode(message.timestamp) : LogicalClockStamp.zero();
            const order = LogicalClockStamp.compare(timestamp, currentTimestamp);

            // if message's timestamp is <= the current observed timestamp we can pass the message through
            // TODO(marik-d): Do we have to order messages agains each other?
            if (order === Order.EQUAL || order === Order.BEFORE) {
              return i;
            }
          } else {
            return i; // pass through all non-ECHO messages
          }
        }
        return undefined;
      }
    );

    // NOTE: The iterator may halt if there are gaps in the replicated feeds (according to the timestamps).
    // In this case it would wait until a replication event notifies another feed has been added to the replication set.
    for await (const { data: { payload }, key, seq } of iterator) {
      log('Muxer:', JSON.stringify(message));

      switch (message.__type_url) {
        //
        // HALO messages.
        //
        case 'dxos.echo.testing.PartyAdmit': {
          assumeType<dxos.echo.testing.IPartyAdmit>(message);
          assert(message.feedKey);

          allowedFeeds.add(keyToString(message.feedKey));
          break;
        }

        //
        // ECHO messages.
        //
        case 'dxos.echo.testing.ItemEnvelope': {
          assumeType<dxos.echo.testing.IItemEnvelope>(message);
          assert(message.itemId);

          const timestamp = LogicalClockStamp.zero().withFeed(key, seq);
          currentTimestamp = LogicalClockStamp.max(currentTimestamp, timestamp);

          // TODO(burdon): Order by timestamp.
          outputStream.push({ data: { payload }, key, seq });

          // TODO(marik-d): Backpressure: https://nodejs.org/api/stream.html#stream_readable_push_chunk_encoding
          // if (!this._output.push({ data: { payload } })) {
          //   await new Promise(resolve => { this._output.once('drain', resolve )});
          // }
          break;
        }

        default:
          console.warn(`Skipping unknown message type ${message.__type_url}`);
          break;
      }
    }
  });

  return outputStream;
};
