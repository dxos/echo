//
// Copyright 2020 DXOS.org
//

import { ValueUtil } from './mutation';
import { Predicate, Query } from './proto';

export type Getter = (item: any, path: string) => any;

interface MatcherOptions {
  getter: Getter;
  minisearch?: any;
}

/**
 * Query processor.
 */
export class Matcher {
  constructor (
    private readonly _options: MatcherOptions
  ) {}

  /**
   * Returns true if item matches the query.
   */
  match (query: Query, item: any): boolean {
    return this._match(item, query.root!);
  }

  /**
   * Recursively match predicate tree.
   */
  _match (item: any, predicate: Predicate): boolean {
    const { getter } = this._options;

    switch (predicate.op) {
      //
      // Boolean operators
      //

      case Predicate.Operation.OR: {
        return predicate.predicates!.findIndex((predicate: Predicate) => this._match(item, predicate)) !== -1;
      }

      case Predicate.Operation.AND: {
        return predicate.predicates!.findIndex((predicate: Predicate) => !this._match(item, predicate)) === -1;
      }

      case Predicate.Operation.NOT: { // NAND
        return predicate.predicates!.findIndex((predicate: Predicate) => !this._match(item, predicate)) !== -1;
      }

      //
      // Equivalence
      //

      case Predicate.Operation.IN: {
        const values = ValueUtil.valueOf(predicate.value!) || [];
        const value = getter(item, predicate.key!);
        return value && values.indexOf(value) !== -1;
      }

      case Predicate.Operation.EQUALS: {
        const value = getter(item, predicate.key!);
        return value === ValueUtil.valueOf(predicate.value!);
      }

      case Predicate.Operation.PREFIX_MATCH: {
        const value = getter(item, predicate.key!);
        if (typeof value === 'string') {
          const match = ValueUtil.valueOf(predicate.value!)?.toLowerCase();
          return match && value.toLowerCase().indexOf(match) === 0;
        }
        break;
      }

      case Predicate.Operation.TEXT_MATCH: {
        const value = getter(item, predicate.key!);
        if (typeof value === 'string') {
          const words = value.toLowerCase().split(/\s+/);
          const match = ValueUtil.valueOf(predicate.value!)?.toLowerCase();
          return match && words.findIndex(word => word.indexOf(match) === 0) !== -1;
        }
        break;
      }
    }

    return false;
  }
}
