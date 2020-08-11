//
// Copyright 2020 DXOS.org
//

import { createId } from '@dxos/crypto';

export type ItemID = string;

/**
 * Item
 */
export class Item {
  _id: ItemID = createId();

  constructor (private _type: string) {}

  get id (): ItemID {
    return this._id;
  }

  get type (): string {
    return this._type;
  }
}
