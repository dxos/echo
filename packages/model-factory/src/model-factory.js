//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import { Writable } from 'stream';
import pump from 'pump';
import Signal from 'signal-promise';
import debounce from 'lodash.debounce';

import { logs } from '@dxos/debug';
import metrics from '@dxos/metrics';

import { Subscriber } from './subscriber';
import { DefaultModel } from './model';
import { bufferedStreamHandler } from './buffer-stream';

const { error } = logs('dxos:echo:model-factory');

/**
 * @callback AppendHandler
 * @param {IModelMessage} data
 * @return {IModelMessage}
 */

/**
 * @callback CredentialsInfoProvider
 * @param {Any} messageData
 * @param {PublicKey} feedKey
 * @return {ICredentialsInfo}
 */

/**
 * Model factory creates instances of Model classes and creates a bound Readable stream configured
 * by the model options, and a Writable stream.
 */
export class ModelFactory {
  /**
   * @param {FeedStore} feedStore
   * @param {Object} options
   * @param {AppendHandler} options.onAppend
   * @param {CredentialsInfoProvider} options.credentialsInfoProvider
   */
  constructor (feedStore, options = {}) {
    assert(feedStore);

    const { onAppend = () => {}, credentialsInfoProvider } = options;

    this._subscriber = new Subscriber(feedStore);
    this._onAppend = onAppend;
    this._credentialsInfoProvider = credentialsInfoProvider;
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

    const onData = bufferedStreamHandler(stream, async (feedMessages) => {
      if (model.destroyed) return;

      const modelMessages = [];
      for await (const feedMessage of feedMessages) {
        const { data, key: feedKey } = feedMessage;
        let credentials;
        if (this._credentialsInfoProvider) {
          credentials = await this._credentialsInfoProvider(data, feedKey);
          if (!credentials) {
            // TODO(telackey): Is this enough, or do we need to destroy the Model as well?
            throw new Error(`Unable to locate credentials for: ${feedMessage}`);
          }
        }
        modelMessages.push({ data, credentials });
      }

      await model.processMessages(modelMessages);
      metrics.inc(`model.${model.id}.length`, modelMessages.length);
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
