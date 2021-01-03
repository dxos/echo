//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { Event } from '@dxos/async';

import { Item } from './item';
import { Link } from './link';

type SelectFilterFunction = (item: Item<any>) => Boolean;

export interface SelectFilterByValue {
  type: string | string[];
}

export type SelectFilter = SelectFilterFunction | SelectFilterByValue;

/**
 * @param filter
 */
const createArrayFilter = (filter: SelectFilterByValue) => {
  if (typeof filter.type === 'string') {
    return (item: Item<any>) => item.type === filter.type;
  }

  // Any type in array.
  assert(Array.isArray(filter.type));
  return (item: Item<any>) => item.type && filter.type.indexOf(item.type) !== -1;
};

/**
 * Remove duplicate and undefined items.
 * @param items
 */
const deduplicate = <T> (items: T[]) => Array.from(new Set(items.filter(Boolean)).values());

/**
 * A chainable object which contains a set of items, and can be used to filter and traverse the object graph.
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
   * Creates a new selection with the parent nodes of the selection.
   */
  parent () {
    return new Selection(this._items.map(item => item.parent).filter(Boolean) as Item<any>[], this._update);
  }

  /**
   * Creates a new selection with the child nodes of the selection.
   */
  children () {
    return new Selection(this._items.flatMap(item => item.children), this._update);
  }

  /**
   * Calls the given function with the current seleciton.
   * @param fn {Function} callback.
   */
  call (fn: (selection: this) => void) {
    fn(this);
    return this;
  }

  /**
   * Calls the given function for each item in the current selection.
   * @param fn {Function} Visitor callback.
   */
  each (fn: (item: I, selection: Selection<I>) => void) {
    this._items.forEach(item => fn(item as any, new Selection([item], this._update)));
    return this;
  }

  /**
   * Creates a new selection by filtering the current selection.
   * @param filter
   */
  filter (filter: SelectFilter): Selection<any> {
    const fn = (typeof filter === 'function') ? filter : createArrayFilter(filter as SelectFilterByValue);
    return new Selection(this._items.filter(fn), this._update);
  }

  /**
   * Creates a new selection by filtering links from the current selection.
   * @param filter
   */
  link (filter: SelectFilter): Selection<any> {
    const fn = (typeof filter === 'function') ? filter : createArrayFilter(filter as SelectFilterByValue);
    return new Selection(deduplicate(this._items.flatMap(
      // TODO(burdon): Links should not be bi-directional (remove the source check).
      item => item.links.filter(link => link.source === item && fn(link))
    )), this._update);
  }

  /**
   * Creates a new selection from the source of the current set of links.
   */
  source (this: Selection<Link<any, any, any>>) {
    // TODO(burdon): Assert links (or sub-class Object/LinkSelection classes?)
    return new Selection(deduplicate(this._items.map(link => link.source)), this._update);
  }

  /**
   * Creates a new selection from the target of the current set of links.
   */
  target (this: Selection<Link<any, any, any>>) {
    // TODO(burdon): Assert links (or sub-class Object/LinkSelection classes?)
    return new Selection(deduplicate(this._items.map(link => link.target)), this._update);
  }
}
