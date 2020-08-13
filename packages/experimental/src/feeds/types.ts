//
// Copyright 2020 DXOS.org
//

import { dxos } from '../proto/gen/testing';

export type FeedKey = Uint8Array;

/**
 * Hypercore message.
 * https://github.com/hypercore-protocol/hypercore
 */
// TODO(burdon): FeedStore block?
export interface IFeedGenericBlock<T> {
  seq: number;
  key: Buffer;
  sync: boolean;
  path: string;
  data: T;
}

export type IFeedBlock = IFeedGenericBlock<dxos.echo.testing.FeedMessage>;

/**
 * Feed metadata.
 */
export interface IFeedMeta {
  feedKey: FeedKey;
  seq: number;
}

/**
 *
 */
export const createExpectedFeedBlock = (data: any) => ({
  key: expect.any(Buffer),
  seq: expect.any(Number),
  sync: expect.any(Boolean),
  data
});
