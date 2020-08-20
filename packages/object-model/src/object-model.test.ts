//
// Copyright 2020 DXOS.org
//

import { createId } from '@dxos/crypto';

import { ObjectModel } from './object-model';

describe('object model', () => {
  test('ObjectModel', async () => {
    const itemId = createId();
    const model = new ObjectModel(itemId);
    expect(model).toBeTruthy();
  });
});
