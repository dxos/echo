//
// Copyright 2020 DxOS.
//

import { EventEmitter } from 'events';
import eos from 'end-of-stream';
import pEvent from 'p-event';

import { Agent } from './agent';

export class Environment extends EventEmitter {
  constructor (topic, network) {
    super();

    this._topic = topic;
    this._network = network;
    this._agents = new Map();

    this._stats = {
      appended: 0,
      processed: 0
    };
  }

  get network () {
    return this._network;
  }

  get peers () {
    return this._network.peers;
  }

  get models () {
    return this._network.peers.reduce((prev, curr) => {
      return [...prev, ...Array.from(curr.models.values())];
    }, []);
  }

  get agents () {
    return Array.from(this._agents.values());
  }

  get stats () {
    return Object.assign({}, this._stats);
  }

  get sync () {
    return this._stats.processed === this._stats.appended * Math.pow(this.models.length, 2);
  }

  getAgent (agentId) {
    return this._agents.get(agentId);
  }

  addAgent (definition) {
    const agent = new Agent(this._topic, definition);
    if (this._agents.has(agent.id)) {
      return this._agents.get(agent.id);
    }

    this._agents.set(agent.id, agent);
    agent.on('preappend', () => {
      this._stats.appended++;
    });
    agent.on('update', ({ messages }) => {
      this._stats.processed += messages.length;
      this.emit('model-update');
    });

    return agent;
  }

  async invitePeer ({ fromPeer = this.peers[0], toPeer }) {
    return fromPeer.invitePeer(toPeer);
  }

  async waitForSync (timeout = 50 * 1000) {
    if (this.sync) {
      return;
    }

    return pEvent(this, 'model-update', {
      timeout,
      filter: () => this.sync
    });
  }

  async destroy () {
    await Promise.all(this.models.map(m => m.destroy()));
    await Promise.all(this._network.peers.map(p => {
      if (p.feedStream.destroyed) return;
      process.nextTick(() => p.feedStream.destroy());
      return new Promise(resolve => eos(p.feedStream, () => resolve));
    }));
    await this._network.destroy();
  }

  getRandomPeer () {
    const peers = this._network.peers;
    return peers[Math.floor(Math.random() * (peers.length - 0)) + 0];
  }
}
