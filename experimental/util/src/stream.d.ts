/// <reference types="node" />
import { PassThrough, Readable, Transform, Writable } from 'stream';
/**
 * Creates a statically checked message, with optional ANY type.
 * @param data
 * @param typeUrl
 */
export declare function createMessage<T>(data: T, typeUrl?: string): T;
/**
 * Creates a readable stream that can be used as a buffer into which messages can be pushed.
 */
export declare function createReadable<T>(): Readable;
/**
 * Creates a writable object stream.
 * @param callback
 */
export declare function createWritable<T>(callback: (message: T) => Promise<void>): NodeJS.WritableStream;
/**
 * Creates a no-op transform.
 */
export declare function createPassThrough<T>(): PassThrough;
/**
 * Creates a transform object stream.
 * @param [callback] Callback or null to pass-through.
 */
export declare function createTransform<R, W>(callback: (message: R) => Promise<W | undefined> | undefined): Transform;
/**
 * Injectable logger.
 * @param logger
 */
export declare function createLoggingTransform(logger?: Function): Transform;
/**
 * Wriable stream that collects objects (e.g., for testing).
 */
export declare class WritableArray<T> extends Writable {
    _objects: T[];
    constructor();
    clear(): void;
    get objects(): T[];
    _write(object: any, _: BufferEncoding, next: (error?: Error | null) => void): void;
}
//# sourceMappingURL=stream.d.ts.map