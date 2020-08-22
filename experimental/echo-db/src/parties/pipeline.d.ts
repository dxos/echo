/// <reference types="node" />
import { Readable, Writable } from 'stream';
import { PartyProcessor } from './party-processor';
interface Options {
    readLogger?: NodeJS.ReadWriteStream;
    writeLogger?: NodeJS.ReadWriteStream;
}
/**
 * Manages the inbound and outbound message pipelines for an individual party.
 */
export declare class Pipeline {
    private readonly _partyProcessor;
    private readonly _feedReadStream;
    private readonly _feedWriteStream?;
    private readonly _options;
    private _readStream;
    private _writeStream;
    /**
     * @param partyProcessor - Processes HALO messages to update party state.
     * @param feedReadStream - Inbound messages from the feed store.
     * @param [feedWriteStream] - Outbound messages to the writable feed.
     * @param [options]
     */
    constructor(partyProcessor: PartyProcessor, feedReadStream: NodeJS.ReadableStream, feedWriteStream?: NodeJS.WritableStream, options?: Options);
    get partyKey(): Uint8Array;
    get isOpen(): boolean;
    get readonly(): boolean;
    get readStream(): Readable | undefined;
    get writeStream(): Writable | undefined;
    /**
     * Create inbound and outbound pipielines.
     * https://nodejs.org/api/stream.html#stream_stream_pipeline_source_transforms_destination_callback
     *
     * Feed
     *   Transform(IFeedBlock => IEchoStream): Party processing (clock ordering)
     *     ItemDemuxer
     *       Transform(dxos.echo.testing.IEchoEnvelope => dxos.echo.testing.IFeedMessage): update clock
     *         Feed
     */
    open(): Promise<[NodeJS.ReadableStream, NodeJS.WritableStream?]>;
    /**
     * Close all streams.
     */
    close(): Promise<void>;
}
export {};
//# sourceMappingURL=pipeline.d.ts.map