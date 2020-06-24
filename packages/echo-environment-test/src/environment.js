//
// Copyright 2020 DxOS.
//

import { EventEmitter } from 'events';
import assert from 'assert';

const kGenerateData = Symbol('generateData');
const kModelLength = Symbol('kModelLength');

export class Environment extends EventEmitter {
  constructor (topic, network) {
    super();

    this._topic = topic;
    this._network = network;
    this._maxMessages = 0;
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

  get totalMessages () {
    return this.models.reduce((prev, curr) => {
      return prev + curr[kModelLength];
    }, 0);
  }

  addModels (models) {
    return Promise.all(models.map(model => this.addModel(model)));
  }

  async addModel (opts = {}) {
    const { ModelClass, generator, options } = opts;

    assert(ModelClass);
    assert(generator);

    for (const peer of this._network.peers) {
      const model = await peer.modelFactory.createModel(ModelClass, { ...options, topic: this._topic });
      model[kGenerateData] = generator(this._topic, peer.id);
      model[kModelLength] = 0;
      peer.models.push(model);
      model.on('update', (_, messages) => {
        model[kModelLength] += messages.length;
        this.emit('model-update', { topic: this._topic, peerId: peer.id, model, messages });
      });
    }
  }

  async appendMessages (maxMessages) {
    for (let i = 0; i < maxMessages; i++) {
      await Promise.all(this.models.map(async (model) => {
        const data = await model[kGenerateData]();
        return model.appendMessage(data);
      }));
    }

    this._maxMessages += maxMessages;
  }

  async waitForSync (timeout = 50000) {
    if (this._checkSync()) {
      return;
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.removeListener('model-update', onUpdate);
        reject(new Error('waitForSync timeout'));
      }, timeout);

      const onUpdate = () => {
        if (this._checkSync()) {
          this.removeListener('model-update', onUpdate);
          clearTimeout(timer);
          return resolve();
        }
      };

      this.on('model-update', onUpdate);
    });
  }

  async destroy () {
    await Promise.all(this.models.map(m => m.destroy()));
    await this._network.destroy();
  }

  _checkSync () {
    return this.totalMessages === this._maxMessages * this.models.length * this._network.peers.length;
  }
}
