//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { humanize } from '@dxos/crypto';

import { createItemDemuxer, Item, ItemFilter, ItemManager, ItemType } from '../items';
import { ResultSet } from '../result';
import { ModelFactory, ModelType } from '../models';
import { PartyStreams } from './party-streams';
import { PartyKey } from './types';
import { createTransform } from '../util';

/**
 * Party.
 */
export class Party {
  private readonly _partyStreams: PartyStreams;
  private readonly _modelFactory: ModelFactory;

  private _itemManager: ItemManager | undefined;
  private _itemDemuxer: NodeJS.WritableStream | undefined;

  /**
   * @param partyStreams
   * @param modelFactory
   */
  constructor (partyStreams: PartyStreams, modelFactory: ModelFactory) {
    assert(partyStreams);
    assert(modelFactory);
    this._partyStreams = partyStreams;
    this._modelFactory = modelFactory;
  }

  toString () {
    return `Party(${JSON.stringify({ key: humanize(this.key) })})`;
  }

  get key (): PartyKey {
    return this._partyStreams.key;
  }

  async open () {
    if (this._itemManager) {
      return this;
    }

    // TODO(burdon): Logging duplex/transforms.
    // TODO(burdon): Support read-only parties.
    const { readStream, writeStream } = await this._partyStreams.open();
    this._itemManager = new ItemManager(this._modelFactory, writeStream);
    this._itemDemuxer = createItemDemuxer(this._itemManager);

    // Connect the read stream.
    readStream.pipe(this._itemDemuxer);

    return this;
  }

  async close () {
    if (!this._itemManager) {
      return this;
    }

    // Disconnect the read stream.
    this._partyStreams.readStream?.unpipe(this._itemDemuxer);

    this._itemManager = undefined;
    this._itemDemuxer = undefined;

    await this._partyStreams.close();

    return this;
  }

  async createItem (itemType: ItemType, modelType: ModelType): Promise<Item> {
    assert(this._itemManager);
    return this._itemManager.createItem(itemType, modelType);
  }

  async queryItems (filter?: ItemFilter): Promise<ResultSet<Item>> {
    assert(this._itemManager);
    return this._itemManager.queryItems(filter);
  }
}
