//
// Copyright 2020 DxOS.org
//

import debug from 'debug';

import {
  Anchor,
  AnchoredMountPoint,
  AnchoredReadableSource,
  AnchoredWriteableSink,
  AppendedMessage,
  EchoMessage
} from './echo-feeds';
import { SerializationSink } from './snapshot';
import { StorageProvider } from './storage';
import { EchoModelFilter, EchoModelQueryResults } from './query';

const log = debug('dxos:echo:model');

// TODO(dboreham): Error handling

// Package external interface

export abstract class EchoModel {
    // Interface with party/feeds
    abstract mount(mountPoint: AnchoredMountPoint): void;
    // Interface with snapshots
    // Implicit current anchor: correct?
    abstract async serialize(sink: SerializationSink): Promise<void>;
    // Interface with persistence
    // TODO(dboreham): This method name is not quite right.
    abstract async registerStorageProvider(provider: StorageProvider): Promise<void>;
    // TODO(dboreham): Query-side interface. Placeholder. Use mixins?
    abstract query(filter: EchoModelFilter) : EchoModelQueryResults;
}

// Implementation

export abstract class BaseModel extends EchoModel {
    // TODO(dboreham): Obviously something about typescript I don't understand here:
    // @ts-ignore
    private messageSink: AnchoredWriteableSink;
    // @ts-ignore
    private messageSource: AnchoredReadableSource;

    mount (mountPoint: AnchoredMountPoint) {
      this.messageSink = mountPoint.getSink();
      this.messageSource = mountPoint.getSource();
      // TODO(dboreham): Use addListener(), don't leak.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.messageSource.on('data', (messages: EchoMessage[], anchor: Anchor) => { this.applyMutations(messages); });
    }

    // Model implementation calls this when it wants to emit a new message.
    // DO NOT MAKE THIS METHOD SYNC
    protected async appendMessage (message: AppendedMessage): Promise<Anchor> {
      // TODO(dboreham): PERFORMANCE avoid generating JSON below if log target disabled.
      log(`model.append: ${JSON.stringify(message)}`);
      return await this.messageSink.append([message]);
    }

    // We call the model implementation via this overridden method to process new messages.
    // DO NOT MAKE THIS METHOD SYNC
    protected abstract async applyMutations(messages: EchoMessage[]): Promise<void>;
}
