/// <reference types="node" />
import { FeedMeta, ItemID } from '@dxos/experimental-echo-protocol';
import { ModelType } from './types';
/**
 * Abstract base class for Models.
 * Models define a root message type, which is contained in the partent Item's message envelope.
 */
export declare abstract class Model<T> {
    static type: ModelType;
    private readonly _modelUpdate;
    private readonly _processor;
    private readonly _itemId;
    private readonly _writable?;
    /**
     * @param itemId Parent item.
     * @param writable Output mutation stream (unless read-only).
     */
    constructor(itemId: ItemID, writable?: NodeJS.WritableStream);
    get itemId(): ItemID;
    get readOnly(): boolean;
    get processor(): NodeJS.WritableStream;
    subscribe(listener: (result: Model<T>) => void): () => void;
    /**
     * Writes the raw mutation to the output stream.
     * @param mutation
     */
    protected write(mutation: T): Promise<void>;
    processMessage(meta: FeedMeta, message: T): Promise<void>;
    /**
     * Process the message.
     * @abstract
     * @param {Object} meta
     * @param {Object} message
     */
    abstract _processMessage(meta: FeedMeta, message: T): Promise<boolean>;
}
//# sourceMappingURL=model.d.ts.map