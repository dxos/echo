//
// Copyright 2020 DXOS.org
//

import { ValueUtil } from './mutation';
import { Predicate, Query } from './proto';

export type Getter = (item: any, path: string) => any;

/**
 * Query processor.
 */
export class QueryProcessor {
  constructor (
    private readonly _query: Query,
    private readonly _getter: Getter
  ) {}

  match (item: any): boolean {
    return this._match(item, this._query.root!);
  }

  _match (item: any, predicate: Predicate): boolean {
    switch (predicate.op) {
      case Predicate.Operation.OR: {
        return !(predicate.predicates!.findIndex((predicate: Predicate) => this._match(item, predicate)) === -1);
      }

      case Predicate.Operation.EQUALS: {
        return this._getter(item, predicate.key!) === ValueUtil.valueOf(predicate.value!);
      }

      case Predicate.Operation.IN: {
        const values = ValueUtil.valueOf(predicate.value!) || [];
        const value = this._getter(item, predicate.key!);
        return value && values.indexOf(value) !== -1;
      }
    }

    return false;
  }
}
