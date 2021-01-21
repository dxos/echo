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

test('create item with props', async () => {
  const [peer1, peer2] = await createModelTestBench({ model: ObjectModel, props: { x: 100 } });
  expect(peer1.id).toEqual(peer2.id);

  expect(peer1.model.toObject()).toEqual({ x: 100 });
  expect(peer2.model.toObject()).toEqual({ x: 100 });
});

test('Add and remove from set', async () => {
  const [peer1] = await createModelTestBench({ model: ObjectModel, props: { x: 100 } });
  const { model } = peer1;

  expect(model.toObject()).toEqual({ x: 100 });

  await model.addToSet('labels', 'green');
  expect(model.toObject()).toEqual({ x: 100, labels: ['green'] });

  await model.addToSet('labels', 'red');
  await model.addToSet('labels', 'blue');
  await model.addToSet('labels', 'green'); // duplicate
  expect(model.toObject()).toEqual({ x: 100, labels: ['green', 'red', 'blue'] });

  await model.removeFromSet('labels', 'blue');
  expect(model.toObject()).toEqual({ x: 100, labels: ['green', 'red'] });
});

test('Push to an array', async () => {
  const [peer1] = await createModelTestBench({ model: ObjectModel, props: { x: 100 } });
  const { model } = peer1;

  expect(model.toObject()).toEqual({ x: 100 });

  await model.pushToArray('numbers', '1');
  expect(model.toObject()).toEqual({ x: 100, numbers: ['1'] });

  await model.pushToArray('numbers', '2');
  await model.pushToArray('numbers', '3');
  await model.pushToArray('numbers', '1'); // duplicate
  expect(model.toObject()).toEqual({ x: 100, numbers: ['1', '2', '3', '1'] });
});
