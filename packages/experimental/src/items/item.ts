//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { Model } from '../models';
import { ItemID, ItemType } from './types';

/**
 * Data item.
 */
export class Item {
  // TODO(burdon): System and user model.
  constructor (
    private _itemId: ItemID,
    private _itemType: ItemType,
    private _model: Model<any>
  ) {
    assert(this._itemId);
    assert(this._itemType);
    assert(this._model);
  }

  toString () {
    return `Item(${JSON.stringify({ itemId: this._itemId, itemType: this._itemType })})`;
  }

  get id (): ItemID {
    return this._itemId;
  }

  get type (): ItemType {
    return this._itemType;
  }

  get model (): Model<any> {
    return this._model;
  }
}
