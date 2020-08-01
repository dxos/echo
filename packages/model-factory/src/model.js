//
// Copyright 2020 DXOS.org
//

import EventEmitter from 'events';

import { createId, humanize } from '@dxos/crypto';

/**
 * @callback AppendHandler
 * @param {ModelData} data
 * @return {ModelData}
 */

/**
 * HOC (withModel) ==> ModelFactory => Model <=> App
 *                 \=> Feed <==========/
 *
 * Events: `append`, `update`, `destroy`
 */
export class Model extends EventEmitter {
  constructor (options = {}) {
    super();

    const { id = createId(), modelFactoryOptions = {} } = options;

    this._id = id;
    this._destroyed = false;
    this._modelFactoryOptions = modelFactoryOptions;
  }

  get id () {
    return humanize(this._id);
  }

  get destroyed () {
    return this._destroyed;
  }

  get modelFactoryOptions () {
    return this._modelFactoryOptions;
  }

  /**
   * @param {AppendHandler} handler
   */
  setAppendHandler (handler) {
    if (this._appendHandler) {
      throw new Error('append handler already defined');
    }
    this._appendHandler = handler;
  }

  async destroy () {
    this._destroyed = true;
    await this.onDestroy();
    this.emit('destroy', this);
  }

  /**
   * @param {ModelMessage[]} messages
   * @returns {Promise<void>}
   */
  async processMessages (messages) {
    await this.onUpdate(messages);
    this.emit('update', this, messages);
  }

  /**
   * @param {ModelMessage} message
   * @returns {Promise<void>}
   */
  async appendMessage (message) {
    // TODO(telackey): What is this event for?
    this.emit('preappend', message);
    message = await this.onAppend(message);
    if (this._appendHandler) {
      await this._appendHandler(message);
    }
    this.emit('append', message);
  }

  //
  // Virtual methods.
  //

  /**
   * @param {ModelMessage} message
   * @returns {Promise<ModelMessage>}
   */
  async onAppend (message) {
    return message;
  }

  /**
   * @param {ModelMessage[]} messages
   * @returns {Promise<void>}
   */
  async onUpdate (messages) {
    throw new Error(`Not processed: ${messages.length}`);
  }

  /**
   * @async
   */
  onDestroy () {}
}

/**
 * Basic log model. Maintains a list of messages in the order read from the stream.
 */
export class DefaultModel extends Model {
  constructor (...args) {
    super(...args);

    this._messages = [];
  }

  get messages () {
    return this._messages;
  }

  async onUpdate (messages) {
    this._messages.push(...messages);
  }
}
