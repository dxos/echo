//
// Copyright 2020 DXOS.org
//

import { Codec } from '@dxos/codec-protobuf';

import EchoSchema from './gen/dxos.json';

export const codec = new Codec('dxos.echo.FeedMessage')
  .addJson(EchoSchema)
  .build();
