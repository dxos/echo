//
// Copyright 2020 DxOS.
//

import { EventEmitter } from 'events';

export class Provider extends EventEmitter {
  /**
   * @async
   */
  run () {
    throw new Error('not implemented');
  }
}
