//
// Copyright 2020 DxOS.
//

import { EventEmitter } from 'events';
import assert from 'assert';
import eos from 'end-of-stream';

import { randomBytes } from '@dxos/crypto';

const kGenerateData = Symbol('generateData');
const kModelId = Symbol('modelId');
const kAppendMessages = Symbol('appendMessages');
const kAppendedMessages = Symbol('appendedMessages');
const kUpdatedMessages = Symbol('updatedMessages');
const kStats = Symbol('stats');

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const waitForCondition = ({ emitter, event, timeout, condition }) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      emitter.removeListener(event, onEvent);
      reject(new Error('timeout'));
    }, timeout);

    const onEvent = () => {
      if (condition()) {
        emitter.removeListener(event, onEvent);
        clearTimeout(timer);
        return resolve();
      }
    };

    emitter.on(event, onEvent);
  });
};

export class Environment extends EventEmitter {
  constructor (topic, network) {
    super();

    this._topic = topic;
    this._network = network;
    this._modelStats = new Map();
    this._appendedMessages = 0;
    this._updatedModelMessages = 0;
    this._updatedStreamMessages = 0;
    this.on('stream-data', ({ messages }) => {
      this._updatedStreamMessages += messages.length;
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
      return [...prev, ...curr.models];
    }, []);
  }

  get appendedMessages () {
    return this._appendedMessages;
  }

  get updatedModelMessages () {
    return this._updatedModelMessages;
  }

  get updatedStreamMessages () {
    return this._updatedStreamMessages;
  }

  addModels (definitions) {
    for (const definition of definitions) {
      this.addModel(definition);
    }
  }

  addModel (definition = {}) {
    const { id = randomBytes(6).toString('hex'), ModelClass, generator, options = {} } = definition;
    assert(ModelClass);
    assert(generator);

    let stats = this._modelStats.get(id);
    if (!stats) {
      stats = {
        models: [],
        appendedMessages: 0,
        updatedMessages: 0
      };

      this._modelStats.set(id, stats);
    }

    for (const peer of this._network.peers) {
      const model = peer.modelFactory.createModel(ModelClass, { ...options, topic: this._topic });
      model[kGenerateData] = generator(this._topic, peer.id);
      model[kModelId] = id;
      model[kAppendedMessages] = 0;
      model[kUpdatedMessages] = 0;
      model[kStats] = stats;

      model[kAppendMessages] = (messages) => {
        // environment total appended messages
        this._appendedMessages += messages;
        // group of models total appended messages
        stats.appendedMessages += messages;
        // single model total appended messages
        model[kAppendedMessages] += messages;
      };

      model.on('update', (_, messages) => {
        // environment total updated messages
        this._updatedModelMessages += messages.length;
        // group of models total updated messages
        stats.updatedMessages += messages.length;
        // single total updated messages
        model[kUpdatedMessages] += messages.length;
        this.emit('model-update', { topic: this._topic, peerId: peer.id, model, messages });
      });

      peer.models.push(model);
      stats.models.push(model);
    }
  }

  getRandomModel (id) {
    let models = this.models;

    if (id) {
      models = models.filter(m => m[kModelId] === id);
    }

    return models[random(0, this.models.length)];
  }

  async appendMessages (model, maxMessages) {
    model[kAppendMessages](maxMessages);

    return Promise.all([...Array(maxMessages).keys()].map(async () => {
      const data = await model[kGenerateData]();
      return model.appendMessage(data);
    }));
  }

  async appendEnvironmentMessages (maxMessages) {
    await Promise.all(this.models.map((model) => this.appendMessages(model, maxMessages)));
  }

  async waitForModelSync (model, timeout = 50 * 1000) {
    const stats = model[kStats];

    if (model[kUpdatedMessages] === stats.appendedMessages) {
      return;
    }

    return waitForCondition({
      emitter: model,
      event: 'update',
      timeout,
      condition: () => {
        return model[kUpdatedMessages] === stats.appendedMessages;
      }
    });
  }

  async waitForEnvironmentSync (timeout = 50 * 1000) {
    if (this._updatedModelMessages === this._appendedMessages * this._network.peers.length) {
      return;
    }

    return waitForCondition({
      emitter: this,
      event: 'model-update',
      timeout,
      condition: () => {
        return this._updatedModelMessages === this._appendedMessages * this._network.peers.length;
      }
    });
  }

  async waitForStreamSync (timeout = 50 * 1000) {
    if (this._updatedStreamMessages === this._appendedMessages * this._network.peers.length) {
      return;
    }

    return waitForCondition({
      emitter: this,
      event: 'peer-data',
      timeout,
      condition: () => {
        return this._updatedStreamMessages === this._appendedMessages * this._network.peers.length;
      }
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
