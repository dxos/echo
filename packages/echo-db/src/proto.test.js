//
// Copyright 2020 DxOS.org
//

import { Codec } from '@dxos/codec-protobuf';

const schema = require('./proto/gen/echo.json');

const codec = new Codec('echo.ObjectMutationSet')
  .addJson(schema)
  .build();

const { values: Operation } = codec.getType('echo.ObjectMutation.Operation');

test('protobuf codec', () => {
  const message = {
    mutations: [
      {
        objectId: 'object-1',
        mutations: [
          {
            key: 'title',
            value: {
              string: 'DXOS'
            }
          },
          {
            operation: Operation.ARRAY_PUSH,
            key: 'versions',
            value: {
              string: '0.0.1'
            }
          }
        ]
      },
      {
        objectId: 'object-2',
        deleted: true
      }
    ]
  };

  const buffer = codec.encode(message);
  const { mutations } = codec.decode(buffer);
  expect(mutations).toHaveLength(2);
});
