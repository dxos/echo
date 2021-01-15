//
// Copyright 2020 DXOS.org
//

import { createModelTestBench } from '@dxos/echo-db';

import { ObjectModel } from './object-model';

// TODO(burdon): Graceful exit.
// A worker process has failed to exit gracefully and has been force exited.
// This is likely caused by tests leaking due to improper teardown.
// Try running with --runInBand --detectOpenHandles to find leaks.

test('create empty item', async () => {
  const [peer1, peer2] = await createModelTestBench({ model: ObjectModel });
  expect(peer1.id).toEqual(peer2.id);

  expect(peer1.model.toObject()).toEqual({});
  expect(peer2.model.toObject()).toEqual({});
});

test.skip('create item with props', async () => {
  const [peer1, peer2] = await createModelTestBench({ model: ObjectModel, props: { x: 100 } });
  expect(peer1.id).toEqual(peer2.id);

  expect(peer1.model.toObject()).toEqual({ x: 100 });
  expect(peer2.model.toObject()).toEqual({ x: 100 });
});
