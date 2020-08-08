//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import { dxos, google } from '../proto/gen/echo';
import IAny = google.protobuf.IAny;
import OrderedModelData = dxos.echo.OrderedModelData;
import IOrderedModelData = dxos.echo.IOrderedModelData;

/* eslint-disable camelcase */

export interface Any extends IAny {
  __type_url: string,
  [key: string]: any
}

export class Any implements Any {
  constructor (properties: any) {
    const { __type_url, type_url, ...rest } = properties;
    assert(__type_url || type_url);

    this.__type_url = __type_url || type_url;

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

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface OrderedAny extends Any {}

export class OrderedAny extends OrderedModelData {
  constructor (properties: IOrderedModelData) {
    super(properties);
    this.__type_url = 'dxos.echo.OrderedModelData';
  }

  // Provide a simple toJSON, since the auto-generated version does not handle 'Any' members properly.
  public toJSON (): { [p: string]: any } {
    return { ...this };
  }

  public static create (properties: IOrderedModelData) {
    return new OrderedAny(properties);
  }
}

export const createOrderedData = (message: any,
  messageId: number | null | undefined = 1,
  previousMessageId: number | null | undefined = 0) => {
  return OrderedAny.create({
    messageId,
    previousMessageId,
    message
  });
};
