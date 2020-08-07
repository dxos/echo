//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import { google } from '../proto/gen/bundle';
import IAny = google.protobuf.IAny;

/* eslint-disable camelcase */

export interface Any extends IAny {
  __type_url: string,
  [key: string]: any
}

export class Any implements Any {
  constructor (properties: any) {
    const { __type_url, type_url, ...rest } = properties;
    assert(type_url || __type_url);
    this.__type_url = __type_url || type_url;
    this.type_url = this.__type_url;

    for (const key of Object.keys(rest)) {
      this[key] = rest[key];
    }
  }

  public static create (properties: any) {
    return new Any(properties);
  }
}
