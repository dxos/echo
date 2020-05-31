//
// Copyright 2020 DxOS.org
//

import { Codec } from '@dxos/codec-protobuf';

test('Protos', () => {
  const codec = new Codec('dxos.echo');

  // TODO(burdon): Test codec.
  expect(codec).not.toBeNull();
});
