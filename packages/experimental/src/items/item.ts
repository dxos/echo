//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import { EventEmitter } from 'events';

import { Model } from '../models';
import { ItemID } from '../types';

const log = debug('dxos:echo:item');

/**
 * Data item.
 */
export class Item extends EventEmitter { // TODO(burdon): Remove EE.
  constructor (
    private _itemId: ItemID,
    private _type: string,
    private _model: Model
  ) {
    super();
    assert(this._itemId);
    assert(this._type);
    assert(this._model);
  }

  get id () {
    return this._itemId;
  }

  get type () {
    return this._type;
  }

  get model () {
    return this._model;
  }
}
