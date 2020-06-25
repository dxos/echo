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

import { NO_LINKS } from './topologies';
import { Environment } from './environment';

export class EnvironmentFactory extends EventEmitter {
  constructor () {
    super();

    this._envs = new Set();
    this._generator = new ProtocolNetworkGenerator((...args) => this._createPeer(...args));
    this._generator.on('error', err => this.emit('error', err));
    this.on('stream-data', data => {
      this._envs.forEach(env => {
        env.emit('stream-data', data);
      });
    });
  }

  onCreatePeer (cb) {
    this._onCreatePeer = cb;
    return this;
  }

  async create (opts = {}) {
    const { topic = randomBytes(32), peer = {}, network: networkOptions = { type: NO_LINKS, parameters: [1] } } = opts;

    // create the local network
    const network = await this._generator[networkOptions.type]({
      topic,
      parameters: networkOptions.parameters,
      peer
    });

    this.emit('network-created', network);

    const env = new Environment(topic, network);
    this.emit('environment-created', env);

    this._envs.add(env);

    return env;
  }

  async _createPeer (topic, peerId, peerOptions) {
    try {
      const peer = await this._onCreatePeer(topic, peerId, peerOptions);

      assert(peer.feedStore, 'peer.feedStore is required');
      assert(peer.modelFactory, 'peer.modelFactory is required');
      assert(peer.createProtocol, 'peer.createProtocol is required');

      peer.id = peerId;
      peer.models = [];
      peer.feedStream = peer.feedStore.createBatchStream(d => {
        if (d.metadata && d.metadata.topic && d.metadata.topic.equals(topic)) {
          return { live: true };
        }
      }).on('data', messages => {
        this.emit('stream-data', { topic, peerId, messages });
      });

      this.emit('peer-created', topic, peer);
      return peer;
    } catch (err) {
      this.emit('error', err);
    }
  }

  async _onCreatePeer (topic, peerId, peerOptions = {}) {
    const { storage = STORAGE_RAM, codec = bufferJson } = peerOptions;

    const feedStore = await FeedStore.create(createStorage(`.temp/${peerId.toString('hex')}`, storage), {
      feedOptions: {
        valueEncoding: 'custom-codec'
      },
      codecs: {
        'custom-codec': codec
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
    onLoad: () => [feed]
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
