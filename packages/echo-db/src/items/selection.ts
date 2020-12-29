//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { Event } from '@dxos/async';

import { Item } from './item';
import { Link } from './link';

export interface SelectFilterByType {
  type: string;
}

export interface SelectFilterByLink {
  link: string;
}

export type SelectFilter = SelectFilterByType | SelectFilterByLink | {};

/**
 * Based loosely on https://github.com/d3/d3-selection
 */
export class Selection<I extends Item<any>> {
  /**
   * @param _items All items in the database.
   * @param _update
   */
  constructor (
    private readonly _items: I[],
    private readonly _update: Event
  ) {}

  get items (): I[] {
    return this._items;
  }

  get update() {
    return this._update;
  }

  each (fn: (item: I, selection: Selection<I>) => void) {
    this._items.forEach(item => fn(item as any, new Selection([item], this._update)));

    return this;
  }

  call (fn: (selection: this) => void) {
    fn(this);

    return this;
  }

  select(filter: SelectFilterByType): Selection<Item<any>>;
  select(filter: SelectFilterByLink): Selection<Link<any, any, any>>;
  select(filter: {}): Selection<I>;

  select (filter: SelectFilter): Selection<any> {
    if ('type' in filter) {
      assert(!(filter as any).link);
      return new Selection(this._items.filter(item => item.type === filter.type), this._update);
    } else if ('link' in filter) {
      return new Selection(deduplicate(this._items.flatMap(item =>
        item.links.filter(link => link.type === filter.link && link.source === item)
      )), this._update);
    } else {
      return new Selection(this._items, this._update);
    }
  }

  target (this: Selection<Link<any, any, any>>) {
    return new Selection(deduplicate(this._items.map(link => link.target)), this._update);
  }
}

const deduplicate = <T> (items: T[]) => Array.from(new Set(items).values());
