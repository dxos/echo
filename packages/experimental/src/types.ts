//
// Copyright 2020 DXOS.org
//

export type ItemID = string;
export type ItemType = string;

export type FeedKey = Uint8Array;

export interface IFeedMeta {
  feedKey: FeedKey;
}

export interface IFeedMessage<T> {
  seq: number,
  data: T
}
