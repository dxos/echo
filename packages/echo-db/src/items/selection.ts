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

// TODO(burdon): Deprecate (filter both objects and links as items).
export interface SelectFilterByLink {
  link: SelectFilterByType;
}

export type SelectFilter = SelectFilterByType | SelectFilterByLink | {};

// TODO(burdon): Implement other filters (e.g., array, contains).
const createFilter = (filter: SelectFilterByType) => (item: Item<any>) => item.type === filter.type;

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

  select(filter: SelectFilterByType): Selection<Item<any>>;
  select(filter: SelectFilterByLink): Selection<Link<any, any, any>>;
  select(filter: {}): Selection<I>;

  /**
   * Creates a new selection context by filtering or traversing the current set.
   * @param [filter] {SelectFilter} Filter applied to each item in the collection.
   */
  select (filter: SelectFilter = {}): Selection<any> {
    if ('type' in filter) {
      assert(!(filter as any).link);
      const fn = createFilter(filter);
      return new Selection(this._items.filter(fn), this._update);
    }

    // TODO(burdon): Separate method.
    if ('link' in filter) {
      const fn = createFilter(filter.link);
      return new Selection(deduplicate(this._items.flatMap(
        // TODO(burdon): Links should not be bidirectional (remove the source check).
        item => item.links.filter(link => link.source === item && fn(link))
      )), this._update);
    }

    return new Selection(this._items, this._update);
  }

  // TODO(burdon): Experimental (deprecate select).
  filter (filter: SelectFilterByType): Selection<any> {
    const fn = createFilter(filter);
    return new Selection(this._items.filter(fn), this._update);
  }

  // TODO(burdon): Experimental (deprecate select).
  link (filter: SelectFilterByType): Selection<any> {
    const fn = createFilter(filter);
    return new Selection(deduplicate(this._items.flatMap(
      // TODO(burdon): Links should not be bidirectional (remove the source check).
      item => item.links.filter(link => link.source === item && fn(link))
    )), this._update);
  }

  /**
   * Creates a new selection context from the targets of the current set of links.
   */
  target (this: Selection<Link<any, any, any>>) {
    // TODO(burdon): Assert links (or sub-class Object/LinkSelection classes?)
    return new Selection(deduplicate(this._items.map(link => link.target)), this._update);
  }

  /**
   * Parent nodes of selection.
   */
  parent () {
    return new Selection(this._items.map(item => item.parent).filter(Boolean) as Item<any>[], this._update);
  }

  /**
   * Child nodes of selection.
   */
  children () {
    return new Selection(this._items.flatMap(item => item.children), this._update);
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
}

/**
 * Remove duplicate and undefined items.
 * @param items
 */
const deduplicate = <T> (items: T[]) => Array.from(new Set(items.filter(Boolean)).values());
