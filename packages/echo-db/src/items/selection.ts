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

type ArrayElement<T> = T extends (infer U)[] ? U : never

/**
 * Based loosely on https://github.com/d3/d3-selection
 */
export class Selection<T> {
  /**
   * @param _data All items in the database.
   * @param _update
   */
  constructor (
    private readonly _data: T,
    private readonly _update: Event
  ) {}

  get items (): T {
    return this._data;
  }

  get data() {
    return this._data;
  }

  get update() {
    return this._update;
  }

  each(this: Selection<Item<any>[]>, fn: (item: ArrayElement<T>, selection: Selection<T>) => void): this {
    this._data.forEach(item => fn(item as any, new Selection([item], this._update) as any));

    return this as any;
  }

  call (fn: (selection: this) => void): this {
    fn(this);

    return this;
  }

  select(this: Selection<Item<any>[]>, filter: SelectFilterByType): Selection<Item<any>[]>;
  select(this: Selection<Item<any>[]>, filter: SelectFilterByLink): Selection<Link<any, any, any>[]>;

  select (this: Selection<Item<any>[]>, filter: SelectFilter): Selection<any> {
    if ('type' in filter) {
      assert(!(filter as any).link);
      return new Selection(this._data.filter(item => item.type === filter.type), this._update);
    } else if ('link' in filter) {
      return new Selection(deduplicate(this._data.flatMap(item =>
        item.links.filter(link => link.type === filter.link && link.source === item)
      )), this._update);
    } else {
      throw new Error(`Invalid filter: ${JSON.stringify(filter)}`);
    }
  }

  target (this: Selection<Link<any, any, any>[]>) {
    return new Selection(deduplicate(this._data.map(link => link.target)), this._update);
  }

  return<U>(getData: () => U): Selection<U> {
    return new Selection(getData(), this._update);
  }
}

const deduplicate = <T> (items: T[]) => Array.from(new Set(items).values());
