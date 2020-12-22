//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { EchoEnvelope, FeedWriter, ItemID, ItemType } from '@dxos/echo-protocol';
import { Model, ModelMeta } from '@dxos/model-factory';

import { Item, LinkData } from './item';

/**
 * Link variant of an item. Link two objects together. Can hold a custom model.
 */
export class Link<M extends Model<any>, L extends Model<any>, R extends Model<any>> extends Item<M> {
  constructor (
    itemId: ItemID,
    itemType: ItemType | undefined,
    modelMeta: ModelMeta, // TODO(burdon): Why is this not part of the Model interface?
    model: M,
    writeStream?: FeedWriter<EchoEnvelope>,
    parent?: Item<any> | null,
    link?: LinkData | null
  ) {
    super(
      itemId,
      itemType,
      modelMeta,
      model,
      writeStream,
      parent,
      link
    );
    assert(!parent, 'Links cannot have parent items.');
    assert(!!link, 'Links must have link data.');
  }

  get isLink (): true {
    assert(super.isLink);
    return true;
  }

  get fromId (): ItemID {
    assert(this._link);
    return this._link.fromId;
  }

  get toId (): ItemID {
    assert(this._link);
    return this._link.toId;
  }

  get from (): Item<L> {
    assert(this._link);
    assert(this._link.from, 'Dangling link');
    return this._link.from;
  }

  get to (): Item<R> {
    assert(this._link);
    assert(this._link.to, 'Dangling link');
    return this._link.to;
  }
}
