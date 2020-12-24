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

export type SelectFilter = SelectFilterByType | SelectFilterByLink;

/**
 * Is this a monad?
 * Based loosely on https://github.com/d3/d3-selection
 */
export class Selection<I extends Item<any>> {
  /**
   * @param _items All items in the database.
   * @param _onUpdate
   */
  constructor (
    private readonly _items: I[],
    private readonly _onUpdate: Event
  ) {}

  get items (): I[] {
    return this._items;
  }

  each (fn: (item: I, selection: Selection<I>) => void) {
    this._items.forEach(item => fn(item as any, new Selection([item], this._onUpdate)));

    return this;
  }

  call (fn: (selection: this) => void) {
    fn(this);

    return this;
  }

  select(filter: SelectFilterByType): Selection<Item<any>>;
  select(filter: SelectFilterByLink): Selection<Link<any, any, any>>;

  select (filter: SelectFilter): Selection<any> {
    if ('type' in filter) {
      assert(!(filter as any).link);
      return new Selection(this._items.filter(item => item.type === filter.type), this._onUpdate);
    } else if ('link' in filter) {
      return new Selection(deduplicate(this._items.flatMap(item =>
        item.xrefs.filter(link => link.type === filter.link && link.from === item)
      )), this._onUpdate);
    } else {
      throw new Error(`Invalid filter: ${JSON.stringify(filter)}`);
    }
  }

  target (this: Selection<Link<any, any, any>>) {
    return new Selection(deduplicate(this._items.map(link => link.to)), this._onUpdate);
  }
}

const deduplicate = <T> (items: T[]) => Array.from(new Set(items).values());
