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
 * A chainable selection context which contains a set of items, and can be used to filter and traverse the object graph.
 *
 * Based loosely on [d3](https://github.com/d3/d3-selection).
 */
export class Selection<I extends Item<any>> {
  /**
   * @param _items All items in the data set.
   * @param _update Update event handler.
   */
  constructor (
    private readonly _items: I[],
    private readonly _update: Event
  ) {}

  get items (): I[] {
    return this._items;
  }

  get update () {
    return this._update;
  }

  /**
   * Calls the given function for each item in the current selection context.
   * @param fn Visitor callback.
   */
  each (fn: (item: I, selection: Selection<I>) => void) {
    this._items.forEach(item => fn(item as any, new Selection([item], this._update)));

    return this;
  }

  /**
   * Calls the given function with the current seleciton context.
   * @param fn Visitor callback.
   */
  call (fn: (selection: this) => void) {
    fn(this);

    return this;
  }

  select(filter: SelectFilterByType): Selection<Item<any>>;
  select(filter: SelectFilterByLink): Selection<Link<any, any, any>>;
  select(filter: {}): Selection<I>;

  /**
   * Creates a new selection context by filtering or traversing the current set.
   * @param [filter] {SelectFilter} Filter applied to each item in the collection.
   */
  select (filter: SelectFilter = {}): Selection<any> {
    // TODO(burdon): Implement other filters (e.g., array, contains).
    if ('type' in filter) {
      assert(!(filter as any).link);
      return new Selection(this._items.filter(
        item => item.type === filter.type
      ), this._update);
    }

    // TODO(burdon): Different method (e.g., .link) using the same filter mechanism above?
    if ('link' in filter) {
      return new Selection(deduplicate(this._items.flatMap(
        item => item.links.filter(link => link.type === filter.link && link.source === item)
      )), this._update);
    }

    return new Selection(this._items, this._update);
  }

  /**
   * Creates a new selection context from the targets of the current set of links.
   */
  target (this: Selection<Link<any, any, any>>) {
    // TODO(burdon): Assert links (or sub-class Object/LinkSelection classes?)
    return new Selection(deduplicate(this._items.map(link => link.target)), this._update);
  }
}

/**
 * Remove duplicate and undefined items.
 * @param items
 */
const deduplicate = <T> (items: T[]) => Array.from(new Set(items.filter(Boolean)).values());
