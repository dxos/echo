//
// Copyright 2020 DxOS.
//

import assert from 'assert';
import pEvent from 'p-event';
import { EventEmitter } from 'events';

const kAgent = Symbol('agent');
const kPeer = Symbol('peer');
const kStats = Symbol('stats');

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export class Agent extends EventEmitter {
  constructor (topic, definition = {}) {
    super();

    const { id, spec = {} } = definition;
    assert(id, 'id is required');
    assert(spec.ModelClass, 'spec.ModelClass is required');

    this._topic = topic;
    this._id = id;
    this._spec = Object.assign({}, { options: {} }, spec);

    this._models = new Set();
    this._appendedMessages = 0;
    this._processedMessages = 0;
  }

  get appendedMessages () {
    return this._appendedMessages;
  }

  get processedMessages () {
    return this._processedMessages;
  }

  get models () {
    return Array.from(this._models.values());
  }

  get sync () {
    return this._processedMessages === (this._appendedMessages * Math.pow(this._models.size));
  }

  createModel (peer) {
    const model = peer.modelFactory.createModel(this._spec.ModelClass, { ...this._spec.options, topic: this._topic });
    model[kAgent] = this;
    model[kPeer] = peer;
    model[kStats] = {
      appendedMessages: 0,
      processedMessages: 0
    };

    model.on('preappend', () => {
      model[kStats].appendedMessages++;
      this._appendedMessages++;
      this.emit('preappend');
    });

    model.on('update', (_, messages) => {
      model[kStats].processedMessages += messages.length;

      if (this.sync) {
        return;
      }

      // updated messages by agent
      this._processedMessages += messages.length;
      this.emit('update', { topic: this._topic, peerId: peer.id, model, messages });
    });

    peer.addModel(model);
    this._models.add(model);

    return model;
  }

  async resetModel (model) {
    const peer = model[kPeer];

    await model.destroy();

    peer.deleteModel(model);
    this._models.delete(model);

    return this.createModel(peer);
  }

  async waitForModelSync (model, timeout = 50 * 1000) {
    const stats = model[kStats];

    if (stats.processedMessages === this._appendedMessages) {
      return;
    }

    return pEvent(model, 'update', {
      timeout,
      filter: () => stats.processedMessages === this._appendedMessages
    });
  }

  async resetModelAndWaitForSync (model, timeout) {
    model = await this.resetModel(model);
    return this.waitForModelSync(model, timeout);
  }

  getRandomModel () {
    const models = this.models;
    return models[random(0, models.length)];
  }
}

export const getAgent = (model) => model[kAgent];
export const getStats = (model) => model[kStats];
