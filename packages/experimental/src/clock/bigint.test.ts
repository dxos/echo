//
// Copyright 2020 DXOS.org
//

import { createKeyPair } from '@dxos/crypto';

import { BigIntToBuffer, BufferToBigInt } from './bigint';

describe('bigint', () => {
  test('conversion to/from buffer', () => {
    const { publicKey } = createKeyPair();
    const bigint = BufferToBigInt(publicKey);
    const key = BigIntToBuffer(bigint);
    expect(publicKey).toEqual(key);
  });
});
