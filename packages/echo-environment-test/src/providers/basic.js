//
// Copyright 2020 DxOS.
//

import pify from 'pify';
import bufferJson from 'buffer-json-encoding';
import assert from 'assert';

import { Protocol } from '@dxos/protocol';
import { DefaultReplicator } from '@dxos/protocol-plugin-replicator';
import { ModelFactory } from '@dxos/model-factory';
import { createStorage, STORAGE_RAM } from '@dxos/random-access-multi-storage';
import { FeedStore } from '@dxos/feed-store';

import { Provider } from './provider';

export class BasicProvider extends Provider {
  constructor (options = {}) {
    super();

    const { storageType = STORAGE_RAM, codec = bufferJson } = options;

    this._storageType = storageType;
    this._codec = codec;
  }

  async run (topic, peerId) {
    const feedStore = await FeedStore.create(createStorage(`.temp/${peerId.toString('hex')}`, this._storageType), {
      feedOptions: {
        valueEncoding: 'custom-codec'
      },
      codecs: {
        'custom-codec': this._codec
      }
    });

    const feed = await feedStore.openFeed('/local', { metadata: { topic } });

    const factory = new ModelFactory(feedStore, {
      onAppend (message) {
        return pify(feed.append.bind(feed))(message);
      }
    });

    return {
      feedStore,
      modelFactory: factory,
      createStream: replicateAll({ topic, peerId, feedStore, feed })
    };
  }
}

export const replicateAll = ({ topic, peerId, feedStore, feed }) => {
  assert(topic);
  assert(peerId);
  assert(feedStore);
  assert(feed);

  const replicator = new DefaultReplicator({
    feedStore,
    onLoad: () => [feed]
  });

  return () => new Protocol({
    streamOptions: {
      live: true
    }
  })
    .setSession({ peerId })
    .setExtensions([replicator.createExtension()])
    .init(topic)
    .stream;
};
