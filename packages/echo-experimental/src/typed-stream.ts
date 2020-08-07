import { Readable, ReadableOptions, Writable } from "stream";

export class TypedReadable<T> extends Readable {
   /**
   * A utility method for creating Readable Streams out of iterators.
   */
  static from<T>(iterable: Iterable<T> | AsyncIterable<T>, options?: ReadableOptions): TypedReadable<T> {
    return Readable.from(iterable, options) as TypedReadable<T>
  }

  read(size?: number): T { return super.read(size) }
  // @ts-ignore
  pipe<S extends TypedWritable<T>>(destination: S, options?: { end?: boolean; }): S {
    return super.pipe(destination as any, options);
  }
  unshift(chunk: T, encoding?: BufferEncoding): void { return super.unshift(chunk, encoding) }
  push(chunk: T, encoding?: BufferEncoding): boolean { return super.push(chunk, encoding) }

  /**
   * Event emitter
   * The defined events on documents including:
   * 1. close
   * 2. data
   * 3. end
   * 4. error
   * 5. pause
   * 6. readable
   * 7. resume
   */
  addListener(event: "close", listener: () => void): this;
  addListener(event: "data", listener: (chunk: T) => void): this;
  addListener(event: "end", listener: () => void): this;
  addListener(event: "error", listener: (err: Error) => void): this;
  addListener(event: "pause", listener: () => void): this;
  addListener(event: "readable", listener: () => void): this;
  addListener(event: "resume", listener: () => void): this;
  addListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.addListener(event, listener);
  }

  emit(event: "close"): boolean;
  emit(event: "data", chunk: T): boolean;
  emit(event: "end"): boolean;
  emit(event: "error", err: Error): boolean;
  emit(event: "pause"): boolean;
  emit(event: "readable"): boolean;
  emit(event: "resume"): boolean;
  emit(event: string | symbol, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  on(event: "close", listener: () => void): this;
  on(event: "data", listener: (chunk: T) => void): this;
  on(event: "end", listener: () => void): this;
  on(event: "error", listener: (err: Error) => void): this;
  on(event: "pause", listener: () => void): this;
  on(event: "readable", listener: () => void): this;
  on(event: "resume", listener: () => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  once(event: "close", listener: () => void): this;
  once(event: "data", listener: (chunk: T) => void): this;
  once(event: "end", listener: () => void): this;
  once(event: "error", listener: (err: Error) => void): this;
  once(event: "pause", listener: () => void): this;
  once(event: "readable", listener: () => void): this;
  once(event: "resume", listener: () => void): this;
  once(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }

  prependListener(event: "close", listener: () => void): this;
  prependListener(event: "data", listener: (chunk: T) => void): this;
  prependListener(event: "end", listener: () => void): this;
  prependListener(event: "error", listener: (err: Error) => void): this;
  prependListener(event: "pause", listener: () => void): this;
  prependListener(event: "readable", listener: () => void): this;
  prependListener(event: "resume", listener: () => void): this;
  prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.prependListener(event, listener);
  }

  prependOnceListener(event: "close", listener: () => void): this;
  prependOnceListener(event: "data", listener: (chunk: T) => void): this;
  prependOnceListener(event: "end", listener: () => void): this;
  prependOnceListener(event: "error", listener: (err: Error) => void): this;
  prependOnceListener(event: "pause", listener: () => void): this;
  prependOnceListener(event: "readable", listener: () => void): this;
  prependOnceListener(event: "resume", listener: () => void): this;
  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.prependOnceListener(event, listener);
  }

  removeListener(event: "close", listener: () => void): this;
  removeListener(event: "data", listener: (chunk: T) => void): this;
  removeListener(event: "end", listener: () => void): this;
  removeListener(event: "error", listener: (err: Error) => void): this;
  removeListener(event: "pause", listener: () => void): this;
  removeListener(event: "readable", listener: () => void): this;
  removeListener(event: "resume", listener: () => void): this;
  removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.removeListener(event, listener);
  }

  [Symbol.asyncIterator](): AsyncIterableIterator<T> {
    return super[Symbol.asyncIterator]();
  }
}

export class TypedWritable<T> extends Writable {
  write(chunk: T, cb?: (error: Error | null | undefined) => void): boolean;
  write(chunk: T, encoding: BufferEncoding, cb?: (error: Error | null | undefined) => void): boolean;
  write(chunk: T, encoding: any, cb?: any): boolean {
    return super.write(chunk, encoding, cb);
  }
  
  // TODO(marik-d): Finish those:
  // /**
  //  * Event emitter
  //  * The defined events on documents including:
  //  * 1. close
  //  * 2. drain
  //  * 3. error
  //  * 4. finish
  //  * 5. pipe
  //  * 6. unpipe
  //  */
  // addListener(event: "close", listener: () => void): this;
  // addListener(event: "drain", listener: () => void): this;
  // addListener(event: "error", listener: (err: Error) => void): this;
  // addListener(event: "finish", listener: () => void): this;
  // addListener(event: "pipe", listener: (src: Readable) => void): this;
  // addListener(event: "unpipe", listener: (src: Readable) => void): this;
  // addListener(event: string | symbol, listener: (...args: any[]) => void): this;

  // emit(event: "close"): boolean;
  // emit(event: "drain"): boolean;
  // emit(event: "error", err: Error): boolean;
  // emit(event: "finish"): boolean;
  // emit(event: "pipe", src: Readable): boolean;
  // emit(event: "unpipe", src: Readable): boolean;
  // emit(event: string | symbol, ...args: any[]): boolean;

  // on(event: "close", listener: () => void): this;
  // on(event: "drain", listener: () => void): this;
  // on(event: "error", listener: (err: Error) => void): this;
  // on(event: "finish", listener: () => void): this;
  // on(event: "pipe", listener: (src: Readable) => void): this;
  // on(event: "unpipe", listener: (src: Readable) => void): this;
  // on(event: string | symbol, listener: (...args: any[]) => void): this;

  // once(event: "close", listener: () => void): this;
  // once(event: "drain", listener: () => void): this;
  // once(event: "error", listener: (err: Error) => void): this;
  // once(event: "finish", listener: () => void): this;
  // once(event: "pipe", listener: (src: Readable) => void): this;
  // once(event: "unpipe", listener: (src: Readable) => void): this;
  // once(event: string | symbol, listener: (...args: any[]) => void): this;

  // prependListener(event: "close", listener: () => void): this;
  // prependListener(event: "drain", listener: () => void): this;
  // prependListener(event: "error", listener: (err: Error) => void): this;
  // prependListener(event: "finish", listener: () => void): this;
  // prependListener(event: "pipe", listener: (src: Readable) => void): this;
  // prependListener(event: "unpipe", listener: (src: Readable) => void): this;
  // prependListener(event: string | symbol, listener: (...args: any[]) => void): this;

  // prependOnceListener(event: "close", listener: () => void): this;
  // prependOnceListener(event: "drain", listener: () => void): this;
  // prependOnceListener(event: "error", listener: (err: Error) => void): this;
  // prependOnceListener(event: "finish", listener: () => void): this;
  // prependOnceListener(event: "pipe", listener: (src: Readable) => void): this;
  // prependOnceListener(event: "unpipe", listener: (src: Readable) => void): this;
  // prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;

  // removeListener(event: "close", listener: () => void): this;
  // removeListener(event: "drain", listener: () => void): this;
  // removeListener(event: "error", listener: (err: Error) => void): this;
  // removeListener(event: "finish", listener: () => void): this;
  // removeListener(event: "pipe", listener: (src: Readable) => void): this;
  // removeListener(event: "unpipe", listener: (src: Readable) => void): this;
  // removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
}