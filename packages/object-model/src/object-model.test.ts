//
// Copyright 2020 DXOS.org
//

import { createModelTestBench } from '@dxos/echo-db';

import { ObjectModel } from './object-model';

test('replication', async () => {
  const { peers, items: [item1, item2] } = await createModelTestBench({
    model: ObjectModel,
    props: { x: 100 }
  });

  expect(item1.id).toEqual(item2.id);

  expect(item1.model.toObject()).toEqual({ x: 100 });
  expect(item2.model.toObject()).toEqual({ x: 100 });

  for await (const peer of peers) {
    await peer.close();
  }
});
