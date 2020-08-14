//
// Copyright 2020 DXOS.org
//

import { Codec } from '@dxos/codec-protobuf';

import TestingSchema from './gen/testing.json';

export const codec = new Codec('dxos.echo.testing.FeedMessage')
  .addJson(TestingSchema)
  .build();
