//
// Copyright 2020 DxOS.
//

import { EventEmitter } from 'events';
import assert from 'assert';
import pify from 'pify';
import bufferJson from 'buffer-json-encoding';

import { randomBytes } from '@dxos/crypto';
import { Protocol } from '@dxos/protocol';
import { DefaultReplicator } from '@dxos/protocol-plugin-replicator';
import { ProtocolNetworkGenerator } from '@dxos/protocol-network-generator';
import { ModelFactory, DefaultModel } from '@dxos/model-factory';
import { createStorage, STORAGE_RAM } from '@dxos/random-access-multi-storage';
import { FeedStore } from '@dxos/feed-store';

import { COMPLETE } from './topologies';
import { Environment } from './environment';

export class EnvironmentFactory extends EventEmitter {
  constructor () {
    super();

    this._generator = new ProtocolNetworkGenerator((...args) => this._createPeer(...args));
    this._generator.on('error', err => this.emit('error', err));
  }

  onCreatePeer (cb) {
    this._onCreatePeer = cb;
    return this;
  }

  async create (opts = {}) {
    const { topic = randomBytes(32), network: networkOptions = { type: COMPLETE, args: [2] } } = opts;

    // create the local network
    const network = await this._generator[networkOptions.type]({
      topic,
      parameters: networkOptions.args
    });

    this.emit('network-created', network);

    const env = new Environment(topic, network);
    this.emit('environment-created', env);

    return env;
  }

  async _createPeer (topic, peerId) {
    try {
      const peer = await this._onCreatePeer(topic, peerId);

      assert(peer.feedStore, 'peer.feedStore is required');
      assert(peer.modelFactory, 'peer.modelFactory is required');
      assert(peer.createProtocol, 'peer.createProtocol is required');

      peer.id = peerId;
      peer.models = [];

      this.emit('peer-created', topic, peer);
      return peer;
    } catch (err) {
      this.emit('error', err);
    }
  }

  async _onCreatePeer (topic, peerId) {
    const feedStore = await FeedStore.create(createStorage(`.temp/${peerId.toString('hex')}`, STORAGE_RAM), {
      feedOptions: {
        valueEncoding: 'buffer-json'
      },
      codecs: {
        'buffer-json': bufferJson
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
      createProtocol: defaultProtocol({ topic, peerId, feedStore, feed })
    };
  }
}

export const defaultModel = {
  ModelClass: DefaultModel,
  generator (_, peerId) {
    let i = 0;
    return () => ({
      __type_url: 'defaultModel',
      id: `${peerId.toString('hex').slice(0, 6)}/${i++}`
    });
  },
  options: {
    type: 'defaultModel'
  }
};

export const defaultProtocol = ({ topic, peerId, feedStore, feed }) => {
  assert(topic);
  assert(peerId);
  assert(feedStore);
  assert(feed);

  const replicator = new DefaultReplicator({
    feedStore,
    onLoad: () => {
      const descriptor = feedStore.getDescriptorByDiscoveryKey(feed.discoveryKey);

      return [{
        key: feed.key,
        discoveryKey: feed.key,
        metadata: descriptor.metadata
      }];
    }
  });

  return () => new Protocol({
    streamOptions: {
      live: true
    }
  })
    .setSession({ peerId })
    .setExtensions([replicator.createExtension()])
    .init(topic);
};
