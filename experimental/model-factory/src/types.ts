//
// Copyright 2020 DXOS.org
//

import { FeedMeta, ItemID } from '@dxos/experimental-echo-protocol';

//
// Types
//

export type ModelType = string;

export type ModelConstructor<T> = new (itemId: ItemID, writable?: NodeJS.WritableStream) => T;

export type ModelMessage<T> = {
  meta: FeedMeta,
  mutation: T
}
