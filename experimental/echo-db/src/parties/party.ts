//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { humanize } from '@dxos/crypto';
import { ObjectModel } from '@dxos/experimental-object-model';
import { ModelFactory, ModelType } from '@dxos/experimental-model-factory';
import { ItemType, PartyKey } from '@dxos/experimental-echo-protocol';

import { createItemDemuxer, Item, ItemFilter, ItemManager } from '../items';
import { ResultSet } from '../result';
import { Pipeline } from './pipeline';

export const PARTY_ITEM_TYPE = 'wrn://dxos.org/item/party';

/**
 * Party.
 */
export class Party {
  private readonly _modelFactory: ModelFactory;
  private readonly _pipeline: Pipeline;

  private _itemManager: ItemManager | undefined;
  private _itemDemuxer: NodeJS.WritableStream | undefined;

  /**
   * @param modelFactory
   * @param pipeline
   */
  constructor (modelFactory: ModelFactory, pipeline: Pipeline) {
    assert(modelFactory);
    assert(pipeline);
    this._modelFactory = modelFactory;
    this._pipeline = pipeline;
  }

  toString () {
    return `Party(${JSON.stringify({ key: humanize(this.key) })})`;
  }

  get key (): PartyKey {
    return this._pipeline.partyKey;
  }

  get isOpen (): boolean {
    return !!this._itemManager;
  }

  /**
   * Opens the pipeline.
   */
  async open () {
    if (this._itemManager) {
      return this;
    }

    // TODO(burdon): Support read-only parties.
    const [readStream, writeStream] = await this._pipeline.open();

    // Connect to the downstream item demuxer.
    this._itemManager = new ItemManager(this._modelFactory, writeStream);
    this._itemDemuxer = createItemDemuxer(this._itemManager);
    readStream.pipe(this._itemDemuxer);

    return this;
  }

  /**
   * Closes the pipeline.
   */
  async close () {
    if (!this._itemManager) {
      return this;
    }

    // Disconnect the read stream.
    this._pipeline.readStream?.unpipe(this._itemDemuxer);

    this._itemManager = undefined;
    this._itemDemuxer = undefined;

    await this._pipeline.close();

    return this;
  }

  async setProperty (key: string, value: any): Promise<Party> {
    const item = await this._getPropertiestItem();
    await (item.model as ObjectModel).setProperty(key, value);
    return this;
  }

  async getProperty (key: string): Promise<any> {
    const item = await this._getPropertiestItem();
    return await (item.model as ObjectModel).getProperty(key);
  }

  // TODO(burdon): Block until model updated?
  async createItem (itemType: ItemType, modelType: ModelType = ObjectModel.meta.type): Promise<Item<any>> {
    assert(this._itemManager);
    return this._itemManager.createItem(itemType, modelType);
  }

  async queryItems (filter?: ItemFilter): Promise<ResultSet<Item<any>>> {
    assert(this._itemManager);
    return this._itemManager.queryItems(filter);
  }

  async _getPropertiestItem (): Promise<Item<ObjectModel>> {
    assert(this.isOpen);
    assert(this._itemManager);
    const { value: items } = await this._itemManager?.queryItems({ type: PARTY_ITEM_TYPE });
    assert(items.length === 1);
    return items[0];
  }
}
