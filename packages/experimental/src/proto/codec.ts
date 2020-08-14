//
// Copyright 2020 DXOS.org
//

import { Codec } from '@dxos/codec-protobuf';

import TestingSchema from './gen/testing.json';

// TODO(burdon): Create generic for Codec.
export const codec = new Codec('dxos.echo.testing.FeedMessage')
  .addJson(TestingSchema)
  .build();

/**
 * Creates a statically checked message, with optional ANY type.
 * @param data
 * @param typeUrl
 */
export function createMessage<T> (data: T, typeUrl?: string): T {
  return typeUrl ? Object.assign({
    __type_url: typeUrl
  }, data) : data;
}
