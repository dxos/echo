//
// Copyright 2020 DxOS.
//

import assert from 'assert';
import pEvent from 'p-event';
import { EventEmitter } from 'events';

import { randomBytes } from '@dxos/crypto';

const kAgent = Symbol('agent');
const kPeer = Symbol('peer');
const kStats = Symbol('stats');

export class Agent extends EventEmitter {
  constructor (topic, definition = {}) {
    super();

    const { id = randomBytes(6).toString('hex'), spec = {} } = definition;
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
    return this._processedMessages === (this._appendedMessages * Math.pow(this._models.size, 2));
  }

  createModel (peer) {
    const model = peer.modelFactory.createModel(this._spec.ModelClass, { ...this._spec.options, topic: this._topic.toString('hex') });
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
      if (!this.sync) {
        this._processedMessages += messages.length;
        this.emit('update', { topic: this._topic, peerId: peer.id, model, messages });
      }

      model[kStats].processedMessages += messages.length;
    });

    peer.addModel(model);
    this._models.add(model);

    if (this._spec.generator) {
      const unsubscribe = this._spec.generator(model, peer);
      if (unsubscribe) {
        model.once('destroy', () => {
          unsubscribe();
        });
      }
    }

    return model;
  }

  async waitForSync (timeout = 50 * 1000) {
    if (this.sync) {
      return;
    }

    return pEvent(this, 'update', {
      timeout,
      filter: () => this.sync
    });
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

  getRandomModel () {
    const models = this.models;
    return models[Math.floor(Math.random() * (models.length - 0)) + 0];
  }
}

export const getAgent = (model) => model[kAgent];
export const getStats = (model) => model[kStats];
