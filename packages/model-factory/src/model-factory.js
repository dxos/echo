//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import { Writable } from 'stream';
import pump from 'pump';
import Signal from 'signal-promise';
import debounce from 'lodash.debounce';

import { log } from '@dxos/debug';
import metrics from '@dxos/metrics';

import { Subscriber } from './subscriber';
import { DefaultModel } from './model';
import { bufferedStreamHandler } from './buffer-stream';
import { createModelMessage } from './shim';

/**
 * Convert the FeedStore-style data into an IModelMessage.
 * @param message
 * @return {IModelMessage}
 */
const feedMessageToModelMessage = (message) => {
  const { data, key } = message;
  return createModelMessage(data, { key });
};

/**
 * Model factory creates instances of Model classes and creates a bound Readable stream configured
 * by the model options, and a Writable stream.
 */
export class ModelFactory {
  /**
   * @param {FeedStore} feedStore
   * @param {Object} options
   * @param {function} options.onAppend
   * @param {function} options.onMessages
   */
  constructor (feedStore, options = {}) {
    assert(feedStore);

    const { onAppend = () => {}, onMessage } = options;

    this._subscriber = new Subscriber(feedStore);
    this._onAppend = onAppend;
    this._onMessage = onMessage;
  }

  /**
   * Creates an instance of the model.
   *
   * @param ModelClass
   * @param options {Object}
   * @param options.topic {String}
   * @param options.readStreamOptions {Object}
   * @param options.batchPeriod {number}
   * @returns {Model}
   */
  createModel (ModelClass = DefaultModel, options = {}) {
    assert(ModelClass);

    const { type, topic, subscriptionOptions = {}, batchPeriod = 50, ...rest } = options;

    // TODO(burdon): Option to cache and reference count models.
    const model = new ModelClass({
      modelFactoryOptions: options
    });

    let queue = [];
    const debouncedAppend = debounce(() => {
      if (queue.length === 0) return;
      const _queue = queue.slice();
      queue = [];

      // TODO(telackey): Since there is no await, can we be certain the messages are written in the correct order?
      for (const { message, signal } of _queue) {
        this._onAppend(message)
          .then(() => {
            signal.notify();
          })
          .catch((err) => {
            signal.notify(err);
          });
      }
    });

    model.setAppendHandler(message => {
      // Why I have to pass the ...rest as it was some kind of extra fields?
      // What happen if someone put a function there, are we going to store [function Function]?
      const signal = new Signal();
      queue.push({ signal, message: { ...message, ...rest } });

      if (queue.length === 100) {
        debouncedAppend.flush();
      } else {
        debouncedAppend();
      }

      return signal.wait();
    });

    metrics.set(`model.${model.id}.options`, { class: ModelClass.name, ...(type && { type }) });

    // I don't understand what this timer is for.
    const createTimer = metrics.start(`model.${model.id}.createTimer`);

    //
    // Incoming messages (create read stream).
    //

    // TODO(burdon): Separate options param for filter.
    const filter = { ...rest };
    if (type) {
      filter.__type_url = type;
    }

    // Whether it was requested or not, feedLevelIndexInfo is required internally.
    const { stream, unsubscribe } = this._subscriber.createSubscription(topic, filter, subscriptionOptions);

    const onData = bufferedStreamHandler(stream, async (messages) => {
      if (model.destroyed) return;

      // Convert the feed messages into ModelMessages.
      messages = messages.map(feedMessageToModelMessage);

      if (this._onMessage) {
        const preprocessed = [];
        for await (const message of messages) {
          const result = await this._onMessage(message, options);
          if (result) {
            preprocessed.push(result);
          } else {
            log('onMessage filtered:', message);
          }
        }
        messages = preprocessed;
      }

      await model.processMessages(messages);
      metrics.inc(`model.${model.id}.length`, messages.length);
    }, batchPeriod);

    const forEachMessage = new Writable({
      objectMode: true,
      write (chunk, _, cb) {
        onData(chunk, cb);
      }
    });

    pump(stream, forEachMessage, () => {
      if (!model.destroyed) {
        model.destroy();
      }
    });

    //
    // Clean-up.
    //

    model.once('destroy', () => {
      unsubscribe();
    });

    createTimer.end();

    return model;
  }

  destroyModel (model) {
    metrics.delete(`model.${model.id}`);
    return model.destroy();
  }
}
