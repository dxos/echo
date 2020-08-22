/// <reference types="node" />
import { ItemManager } from './item-manager';
/**
 * Creates a stream that consumes `IEchoStream` messages and routes them to the associated items.
 * @param itemManager
 */
export declare const createItemDemuxer: (itemManager: ItemManager) => NodeJS.WritableStream;
//# sourceMappingURL=item-demuxer.d.ts.map