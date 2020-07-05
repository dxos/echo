//
// Copyright 2020 DxOS.org
//

import debug from 'debug';

import { LastWriterObjectModel } from './last-writer-object-model';
import { TestPartyNetwork } from './testing/test-party-network';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const log = debug('dxos.echo.test');

const TYPE_TEST_ECHO_OBJECT = 'wrn_dxos_org_test_echo_object';

test('LastWriterObjectModel:basic', async () => {
  const model = new LastWriterObjectModel();
  const testNetwork = new TestPartyNetwork(1);
  const testNode = testNetwork.getNode(0);
  const mountPoint = testNode.getMountPoint();
  model.mount(mountPoint);

  const itemId = await model.createItem(TYPE_TEST_ECHO_OBJECT, { prop1: 'prop1value' });
  await model.updateItem(itemId, { prop2: 'prop2value' });

  const anchorAfterUpdate = mountPoint.getSink().getAnchor();
  await mountPoint.getSource().waitForAnchor(anchorAfterUpdate);

  const objects = model.getObjectsByType(TYPE_TEST_ECHO_OBJECT);
  expect(objects.length).toBe(1);
  const object = objects[0];
  expect(object).toHaveProperty('properties');
  expect(object.properties).toHaveProperty('prop1', 'prop1value');
  expect(object.properties).toHaveProperty('prop2', 'prop2value');

  // Check that getItem gives the same info.
  expect(object).toEqual(model.getItem(itemId));
});

test.skip('LastWriterObjectModel:concurrent-mutations-two-nodes', async () => {
  const testNetwork = new TestPartyNetwork(2);

  // NodeA
  const testNodeA = testNetwork.getNode(0);
  const modelA = new LastWriterObjectModel();
  const mountPointA = testNodeA.getMountPoint();
  modelA.mount(mountPointA);

  // NodeB
  const testNodeB = testNetwork.getNode(1);
  const modelB = new LastWriterObjectModel();
  const mountPointB = testNodeB.getMountPoint();
  modelB.mount(mountPointB);

  const itemId1 = await modelA.createItem(TYPE_TEST_ECHO_OBJECT, { prop1: 'prop1value' });
  await modelA.updateItem(itemId1, { prop2: 'prop2value' });

  // Check data exists in NodeA
  const anchorAfterUpdateA = mountPointA.getSink().getAnchor();
  await mountPointA.getSource().waitForAnchor(anchorAfterUpdateA);

  const objectsA = modelA.getObjectsByType(TYPE_TEST_ECHO_OBJECT);
  expect(objectsA.length).toBe(1);
  const objectA = objectsA[0];
  expect(objectA).toHaveProperty('properties');
  expect(objectA.properties).toHaveProperty('prop1', 'prop1value');
  expect(objectA.properties).toHaveProperty('prop2', 'prop2value');

  // Check that getItem gives the same info.
  expect(objectA).toEqual(modelA.getItem(itemId1));

  // Replicate to NodeB
  await testNetwork.replicateAll();

  // Check data exists in NodeB
  await mountPointB.getSource().waitForAnchor(anchorAfterUpdateA);

  const objectsB = modelB.getObjectsByType(TYPE_TEST_ECHO_OBJECT);
  expect(objectsB.length).toBe(1);
  const objectB = objectsB[0];
  expect(objectB).toHaveProperty('properties');
  expect(objectB.properties).toHaveProperty('prop1', 'prop1value');
  expect(objectB.properties).toHaveProperty('prop2', 'prop2value');

  // Check that getItem gives the same info.
  expect(objectB).toEqual(modelA.getItem(itemId1));
});

// TODO(dboreham): Consistency tests.
