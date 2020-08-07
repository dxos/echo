declare module '@dxos/feed-store' {
  export class FeedDescriptor {
    key: Buffer;
    path: string;
    feed: hypercore.Feed;
    opened: boolean;
  }

  export class FeedStore {
    closed: boolean;
    closing: boolean;
    opened: boolean;
    constructor (storage: any, options: any);
    getOpenFeed (inspect: (descriptor: FeedDescriptor) => boolean);
    getDescriptors (): [FeedDescriptor];
    ready (): Promise;
    open (): Promise;
    close ();
    openFeed (string: path): Promise<hypercore.Feed>;
    createReadStream (options: any): NodeJS.ReadableStream;
  }
}
