//
// Copyright 2020 DXOS.org
//

import { Codec } from '@dxos/codec-protobuf';
import EchoSchema from '@dxos/experimental-echo-protocol/dist/src/proto/gen/echo.json';

import TestingSchema from '../proto/gen/testing.json';

export const codec = new Codec('dxos.echo.FeedMessage')
  .addJson(EchoSchema)
  .addJson(TestingSchema)
  .build();
