//
// Copyright 2020 DxOS.
//

import pify from 'pify';
import bufferJson from 'buffer-json-encoding';
import assert from 'assert';

import { Protocol } from '@dxos/protocol';
import { DefaultReplicator } from '@dxos/protocol-plugin-replicator';
import { ModelFactory } from '@dxos/model-factory';
import { FeedStore } from '@dxos/feed-store';

import { Provider } from './provider';

export class BasicProvider extends Provider {
  constructor (options = {}) {
    super(options);

    const { codec = bufferJson } = options;

    this._codec = codec;
  }

  async run (topic, peerId) {
    const feedStore = await FeedStore.create(this.createStorage(peerId), {
      feedOptions: {
        valueEncoding: 'custom-codec'
      },
      codecs: {
        'custom-codec': this._codec
      }
    });

    const feed = await feedStore.openFeed('/local', { metadata: { topic } });

    const modelFactory = new ModelFactory(feedStore, {
      onAppend (message) {
        return pify(feed.append.bind(feed))(message);
      }
    });

    return {
      // TODO(tinchoz49): make public feedStore and modelFactory in data-client.
      client: {
        feedStore,
        modelFactory
      },
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
