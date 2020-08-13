//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import { EventEmitter } from 'events';

import { Model } from '@dxos/experimental/dist/models';
import { ItemID, ItemType } from '@dxos/experimental/dist/types';

// TODO(burdon): Create item stream tests first (for both system and user models).
// TODO(burdon): Item should create stream (for local and user model).

/**
 * Data item.
 */
export class Item extends EventEmitter { // TODO(burdon): Remove EE.
  constructor (
    private _itemId: ItemID,
    private _itemType: ItemType,
    private _model: Model<any>
  ) {
    super();
    assert(this._itemId);
    assert(this._itemType);
    assert(this._model);
  }

  get id () {
    return this._itemId;
  }

  get type () {
    return this._itemType;
  }

  get model () {
    return this._model;
  }
}
