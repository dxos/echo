import { FeedKey } from "@dxos/echo-protocol";
import { MaybePromise } from "@dxos/util";
import { Feed } from 'hypercore'
import pify from "pify";

export interface WriteReceipt {
  feedKey: FeedKey
  seq: number
}

export interface FeedWriter<T> {
  write: (message: T) => Promise<WriteReceipt>
}

export function mapFeedWriter<T, U>(map: (arg: T) => MaybePromise<U>, writer: FeedWriter<U>): FeedWriter<T> {
  return {
    write: async message => writer.write(await map(message)),
  };
}

export function createFeedWriter<T>(feed: Feed): FeedWriter<T> {
  return {
    write: async message => {
      const seq = await pify(feed.append.bind(feed))(message);
      return {
        feedKey: feed.key,
        seq,
      }
    }
  }
}
