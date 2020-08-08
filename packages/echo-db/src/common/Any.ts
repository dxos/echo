//
// Copyright 2020 DXOS.org
//

import { google } from '../proto/gen/echo';
import IAny = google.protobuf.IAny;

/* eslint-disable camelcase */

export interface Any extends IAny {
  __type_url: string,
  [key: string]: any
}

export class Any implements Any {
  constructor (properties: any) {
    const { __type_url, type_url, ...rest } = properties;

    // If there is no type_url, at least for one of our auto-generated classes we can guess it from the class name.
    this.__type_url = __type_url || type_url || `dxos.echo.${properties.constructor.name}`;

    for (const key of Object.keys(rest)) {
      this[key] = rest[key];
    }
  }

  set type_url (type: string) {
    this.__type_url = type;
  }

  get type_url () {
    return this.__type_url;
  }

  // Provide a simple toJSON, since the auto-generated version does not handle 'Any' members properly.
  public toJSON (): { [p: string]: any } {
    return { ...this };
  }

  public static create (properties: any) {
    return new Any(properties);
  }
}
