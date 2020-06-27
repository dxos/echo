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

    this._appendedMessages = 0;
    this._processedModelMessages = 0;
    this._processedStreamMessages = 0;
    this.on('stream-data', ({ messages }) => {
      this._processedStreamMessages += messages.length;
    });
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

  get appendedMessages () {
    return this._appendedMessages;
  }

  get processedModelMessages () {
    return this._processedModelMessages;
  }

  get processedStreamMessages () {
    return this._processedStreamMessages;
  }

  get expectedMaxMessages () {
    return this._appendedMessages * Math.pow(this.models.length);
  }

  get sync () {
    return this.__processedModelMessages === this.expectedMaxMessages;
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
      this._appendedMessages++;
    });
    agent.on('update', ({ messages }) => {
      this._processedMessages += messages.length;
      this.emit('model-update');
    });

    return agent;
  }

  async waitForEnvironmentSync (timeout = 50 * 1000) {
    if (this.sync) {
      return;
    }

    return pEvent(this, 'model-update', {
      timeout,
      filter: () => this.sync
    });
  }

  async waitForStreamSync (timeout = 50 * 1000) {
    if (this._processedStreamMessages === this.expectedMaxMessages) {
      return;
    }

    return pEvent(this, 'stream-data', {
      timeout,
      filter: () => this._processedStreamMessages === this.expectedMaxMessages
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
}
