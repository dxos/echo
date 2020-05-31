//
// Copyright 2020 DxOS.org
//

import { Codec } from '@dxos/codec-protobuf';

test('Protos', () => {
  const codec = new Codec('dxos.echo');
  expect(codec).not.toBeNull();
});
