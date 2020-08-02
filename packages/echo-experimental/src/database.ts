//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import EventEmitter from 'events';
import through2 from 'through2';

/**
 * Abstract base class for Models.
 * @abstract
 */
export class Model extends EventEmitter {
  _id: string;
  _readable: ReadableStream;
  _writable?: WritableStream;

  constructor (id: string, readable: ReadableStream, writable?: WritableStream) {
    super();
    this._id = id;
    this._readable = readable;
    this._writable = writable;
  }

  /**
   * Start processing the stream.
   */
  // TODO(burdon): Stop on destroy?
  start () {
    this._readable.pipe(through2.obj(async (message, _, callback) => {
      const { data } = message;
      await this.processMessage(data);
      this.emit('update');
      callback();
    }));

    return this;
  }

  /**
   * Process the message.
   * @abstract
   * @param {Object} message
   */
  async processMessage (message: any) {
    assert(message);
  }
}

/**
 * Creates Model instances from a registered collection of Model types.
 */
export class ModelFactory {
  _models = new Map();

  registerModel (id: string, clazz: Function) {
    assert(id);
    assert(clazz);
    this._models.set(id, clazz);
    return this;
  }

  // TODO(burdon): ID and version.
  createModel (id: string, readable: ReadableStream, writable?: WritableStream) {
    const clazz = this._models.get(id);
    if (clazz) {
      // eslint-disable-next-line new-cap
      const model = new clazz(id, readable, writable);
      model.start();
      return model;
    }
  }
}

/**
 * Data item.
 */
export class Item {
  _model: Model;

  constructor (model: Model) {
    this._model = model;
  }
}

export class ItemDemuxer {

}
