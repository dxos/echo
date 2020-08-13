//
// Copyright 2020 DXOS.org
//

import { Codec } from '@dxos/codec-protobuf';
import { FeedDescriptor } from '@dxos/feed-store';

import TestingSchema from '../../src/proto/gen/testing.json';

import { createPartyAdmit } from '../../src/testing';
import { FeedKey } from '../../src/types';

const codec = new Codec('dxos.echo.testing.FeedEnvelope')
  .addJson(TestingSchema)
  .build();

describe('Feed tests:', () => {
  test('codec', () => {
    const feedDescriptor = new FeedDescriptor('test-feed');
    const feedKey: FeedKey = feedDescriptor.key;
    const message1 = createPartyAdmit(feedKey);

    const buffer = codec.encode(message1);
    const message2 = codec.decode(buffer);
    expect(message1).toEqual(message2);
  });

  test('keys', () => {
    const feedDescriptor = new FeedDescriptor('test-feed');
    const keys = new Set<FeedKey>();
    keys.add(feedDescriptor.key);

    const { payload: { feedKey } } = codec.decode(codec.encode(createPartyAdmit(feedDescriptor.key)));

    // Test keys.
    expect(feedKey).toEqual(feedDescriptor.key);
    expect(Array.from(keys.values())[0]).toEqual(feedDescriptor.key);
    expect(keys.has(feedKey)).toBeFalsy(); // Sets use strict === value equivalence.
  });
});
