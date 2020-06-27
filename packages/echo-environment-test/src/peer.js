//
// Copyright 2020 DxOS.
//

import assert from 'assert';
import { EventEmitter } from 'events';
import eos from 'end-of-stream';

export class Peer extends EventEmitter {
  constructor (opts = {}) {
    super();

    const { topic, peerId, feedStore, modelFactory, createStream, peerOptions } = opts;

    assert(topic);
    assert(peerId);
    assert(feedStore);
    assert(modelFactory);
    assert(createStream);

    this._topic = topic;
    this._id = peerId;
    this._feedStore = feedStore;
    this._modelFactory = modelFactory;
    this._options = peerOptions;
    this._models = new Set();
    this._processedMessages = 0;

    if (createStream) {
      this._createStream = createStream;
    }

    this._feedStream = feedStore.createBatchStream(d => {
      if (d.metadata && d.metadata.topic && d.metadata.topic.equals(topic)) {
        return { live: true };
      }
    }).on('data', messages => {
      this._processedMessages += messages.length;
      this.emit('stream-data', { topic, peerId, messages });
    });
  }

  get topic () {
    return this._topic;
  }

  get id () {
    return this._id;
  }

  get feedStore () {
    return this._feedStore;
  }

  get modelFactory () {
    return this._modelFactory;
  }

  get createStream () {
    return this._createStream;
  }

  get options () {
    return this._peerOptions;
  }

  get models () {
    return Array.from(this._models.values());
  }

  get processedMessages () {
    return this._processedMessages;
  }

  addModel (model) {
    this._models.add(model);
  }

  deleteModel (model) {
    this._models.delete(model);
  }

  destroy () {
    if (this._feedStream.destroyed) return;
    process.nextTick(() => this._feedStream.destroy());
    return new Promise(resolve => eos(this._feedStream, () => resolve));
  }
}
