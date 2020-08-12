//
// Copyright 2020 DXOS.org
//

// TODO(burdon): Move feed defs here.
import { Feed } from 'hypercore';
import { Writable } from 'stream';

// TODO(burdon): See below.
export interface FeedMessage {
  seq: number;
  key: Buffer;
  data: any;
}

/**
 * Hypercore message.
 * https://github.com/hypercore-protocol/hypercore
 */
export interface HypercoreBlock<T> {
  seq: number;
  data: T;
}

/**
 * Turns a stream into constantly mutating array of all messages emmited by the stream.
 * Triggers stream consumption.
 * @param stream
 */
// TODO(burdon): Rename.
export const collect = (stream: NodeJS.ReadableStream) => {
  const array: any[] = [];
  stream.on('data', data => { array.push(data); });
  return array;
};

/**
 * Returns a stream that appends messages directly to a hypercore feed.
 * @param feed
 * @returns {NodeJS.WritableStream}
 */
export const createWritableFeedStream = (feed: Feed) => new Writable({
  objectMode: true,
  write (message, _, callback) {
    feed.append(message, callback);
  }
});
