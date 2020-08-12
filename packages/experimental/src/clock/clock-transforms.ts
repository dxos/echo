//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import { Transform } from 'stream';

import { dxos } from '../proto/gen/testing';

import { LogicalClockStamp } from './logical-clock-stamp';
import { assertAnyType } from '../util';

const log = debug('dxos:echo:muxer');

/**
 *
 */
export const createTimestampTransforms = (writeFeedKey: Buffer) => {
  let currentTimestamp = new LogicalClockStamp();

  const inboundTransform = new Transform({
    objectMode: true,
    // TODO(burdon): Rename message.
    transform (chunk, encoding, callback) {
      const { message } = chunk.data;
      assertAnyType<dxos.echo.testing.IItemEnvelope>(message, 'dxos.echo.testing.ItemEnvelope');

      const timestamp = (message.timestamp
        ? LogicalClockStamp.decode(message.timestamp)
        : LogicalClockStamp.zero()).withFeed(chunk.key, chunk.seq);

      currentTimestamp = LogicalClockStamp.max(currentTimestamp, timestamp);
      log(`Current timestamp: ${currentTimestamp.log()}`);

      callback(null, chunk);
    }
  });

  const outboundTransform = new Transform({
    objectMode: true,
    // TODO(burdon): Rename message.
    transform (chunk, encoding, callback) {
      const { message } = chunk;
      assertAnyType<dxos.echo.testing.IItemEnvelope>(message, 'dxos.echo.testing.ItemEnvelope');
      message.timestamp = LogicalClockStamp.encode(currentTimestamp.withoutFeed(writeFeedKey));
      callback(null, chunk);
    }
  });

  return [inboundTransform, outboundTransform] as const;
};
