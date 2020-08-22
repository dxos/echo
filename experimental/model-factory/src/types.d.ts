/// <reference types="node" />
import { FeedMeta, ItemID } from '@dxos/experimental-echo-protocol';
export declare type ModelType = string;
export declare type ModelConstructor<T> = new (itemId: ItemID, writable?: NodeJS.WritableStream) => T;
export declare type ModelMessage<T> = {
    meta: FeedMeta;
    mutation: T;
};
//# sourceMappingURL=types.d.ts.map