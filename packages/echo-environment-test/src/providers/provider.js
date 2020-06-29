//
// Copyright 2020 DxOS.
//

import { EventEmitter } from 'events';

import { createStorage, STORAGE_RAM } from '@dxos/random-access-multi-storage';
import { randomBytes } from '@dxos/crypto';

export class Provider extends EventEmitter {
  constructor (options = {}) {
    super();

    const { storageType = STORAGE_RAM } = options;

    this._storageType = storageType;
    this._topic = randomBytes(32);
  }

  get topic () {
    return this._topic;
  }

  createStorage (path) {
    return createStorage(`.temp/${Buffer.isBuffer(path) ? path.toString('hex') : path}`, this._storageType);
  }

  /**
   * @async
   */
  before () {}

  /**
   * @async
   */
  run () {
    throw new Error('not implemented');
  }

  /**
   * @async
   */
  after (peers) {}
}
