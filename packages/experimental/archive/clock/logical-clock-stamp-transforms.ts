//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import { Transform } from 'stream';

import { dxos } from '@dxos/experimental/src/proto/gen/testing';

import { LogicalClockStamp } from './logical-clock-stamp';
import { FeedKey } from '@dxos/experimental/dist/types';
import { assertAnyType } from '@dxos/experimental/dist/util';

const log = debug('dxos:echo:clock');

/**
 * Create inbound and oubound transformers to process the timestamp.
 */
export const createTimestampTransforms = (writeFeedKey: Buffer) => {
  let currentTimestamp = new LogicalClockStamp();

  //
  // Get up-to-date timestamp from inbound stream.
  //
  const inboundTransform = new Transform({
    objectMode: true,
    transform (message, encoding, callback) {
      assertAnyType<dxos.echo.testing.IFeedStream>(message, 'dxos.echo.testing.FeedStream');
      assert(message.meta && message.data && message.data.echo);
      const { meta: { feedKey, seq }, data: { echo: { timestamp } } } = message;

      const newTimestamp = (timestamp ? LogicalClockStamp.decode(timestamp) : LogicalClockStamp.zero())
        .withFeed(feedKey as FeedKey, seq as number);

      currentTimestamp = LogicalClockStamp.max(currentTimestamp, newTimestamp);
      log(`Inbound: ${currentTimestamp.log()}`);

      callback(null, message);
    }
  });

  //
  // Write current timestamp to outbound stream.
  //
  const outboundTransform = new Transform({
    objectMode: true,
    transform (object, encoding, callback) {
      assertAnyType<dxos.echo.testing.IEchoEnvelope>(object, 'dxos.echo.testing.EchoEnvelope');

      const timestamp = currentTimestamp.withoutFeed(writeFeedKey);
      log(`Outbound: ${timestamp.log()}`);

      callback(null, Object.assign(object, { timestamp: LogicalClockStamp.encode(timestamp) }));
    }
  });

  return [inboundTransform, outboundTransform] as const;
};
