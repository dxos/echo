//
// Copyright 2020 DXOS.org
//

// TODO(burdon): Why is this needd (and why buffer)?
// TODO(burdon): Move to util.
// BigInt/Buffer conversion functions.
// From: https://coolaj86.com/articles/convert-js-bigints-to-typedarrays
// Exported only for unit testing.

export const BigIntToBuffer = (input: BigInt) => {
  let hex = BigInt(input).toString(16);
  if (hex.length % 2) {
    hex = '0' + hex;
  }

  const length = hex.length / 2;
  const u8 = new Uint8Array(length);

  let i = 0;
  let j = 0;
  while (i < length) {
    u8[i] = parseInt(hex.slice(j, j + 2), 16);
    i += 1;
    j += 2;
  }

  return Buffer.from(u8);
};

export const BufferToBigInt = (input: Buffer) => {
  // TODO(dboreham): Character array?
  const hex:string[] = [];
  const u8 = Uint8Array.from(input);

  u8.forEach((i) => {
    let h = i.toString(16);
    if (h.length % 2) {
      h = '0' + h;
    }
    hex.push(h);
  });

  return BigInt('0x' + hex.join(''));
};
