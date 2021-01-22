//
// Copyright 2020 DXOS.org
//

import MiniSearch from 'minisearch';

import { Getter } from './matcher';

interface IndexerOptions {
  fields: string[];
  getter: Getter;
}

/**
 * Text indexer.
 */
export class Indexer {
  readonly _minisearch: MiniSearch;

  private _items: any[] = [];

  constructor ({ fields, getter }: IndexerOptions) {
    // https://lucaong.github.io/minisearch/classes/_minisearch_.minisearch.html#options-and-defaults
    this._minisearch = new MiniSearch({
      idField: 'id',
      fields,
      extractField: getter
    });
  }

  update (items: any[]) {
    // TODO(burdon): Monitor memory usage and timing.
    // TODO(burdon): Calcuate diff.
    this._items = items;
    this._minisearch.removeAll();
    this._minisearch.addAll(items);
    return this;
  }

  match (text: string) {
    return this._minisearch.search(text)
      .map(result => ({ ...result, item: this._items.find(item => item.id === result.id) }));
  }
}
