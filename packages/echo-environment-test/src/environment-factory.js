//
// Copyright 2020 DxOS.
//

import { EventEmitter } from 'events';

import { randomBytes } from '@dxos/crypto';
import { ProtocolNetworkGenerator } from '@dxos/protocol-network-generator';

import { Environment } from './environment';
import { Peer } from './peer';
import assert from 'assert';

export const networkTypes = {
  LADDER: 'ladder',
  COMPLETE: 'complete',
  COMPLETE_BIPARTITE: 'completeBipartite',
  BALANCED_BIN_TREE: 'balancedBinTree',
  PATH: 'path',
  CIRCULAR_LADDER: 'circularLadder',
  GRID: 'grid',
  GRID3: 'grid3',
  NO_LINKS: 'noLinks',
  WATTS_STROGATZ: 'wattsStrogatz'
};

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

  setProvider (provider) {
    this._provider = provider;
    return this;
  }

  async create (opts = {}) {
    assert(this._provider, 'a provider is required');

    const { topic = randomBytes(32), peer = {}, network: networkOptions = { type: networkTypes.NO_LINKS, parameters: [1] } } = opts;

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
      const { feedStore, modelFactory, createStream } = await this._provider.run(topic, peerId, peerOptions);

      const peer = new Peer({
        topic,
        peerId,
        feedStore,
        modelFactory,
        createStream,
        options: peerOptions
      });

      this.emit('peer-created', topic, peer);
      return peer;
    } catch (err) {
      this.emit('error', err);
    }
  }
}
