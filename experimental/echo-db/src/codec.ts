//
// Copyright 2020 DXOS.org
//

import { Codec } from '@dxos/codec-protobuf';

// TODO(burdon): Move from dist.
import ObjectModelSchema from '@dxos/experimental-object-model/dist/src/proto/gen/object.json';

// TODO(burdon): Create generic for Codec.
export const codec = new Codec('dxos.echo.FeedMessage')
  .addJson(ObjectModelSchema)
  .build();
