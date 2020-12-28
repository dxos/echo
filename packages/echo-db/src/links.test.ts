//
// Copyright 2020 DXOS.org
//

import { ObjectModel } from '@dxos/object-model';

import { createTestInstance } from './testing/test-utils';

const OBJECT_PERSON = 'dxn:echo.dxos:object/person';
const OBJECT_ORG = 'dxn:echo.dxos:object/org';
const LINK_EMPLOYEE = 'dxn:echo.dxos:link/employee';
const LINK_FRIENDS_WITH = 'dxn:echo.dxos:link/friends-with';

test('directed links', async () => {
  const echo = await createTestInstance({ initialize: true });
  const party = await echo.createParty();

  const p1 = await party.database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name: 'Alice' } });
  const p2 = await party.database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name: 'Bob' } });

  const org1 = await party.database.createItem({ model: ObjectModel, type: OBJECT_ORG, props: { name: 'DXOS' } });
  const org2 = await party.database.createItem({ model: ObjectModel, type: OBJECT_ORG, props: { name: 'ACME' } });

  await party.database.createLink({ source: org1, type: LINK_EMPLOYEE, target: p1 });
  await party.database.createLink({ source: org1, type: LINK_EMPLOYEE, target: p2 });
  await party.database.createLink({ source: org2, type: LINK_EMPLOYEE, target: p2 });

  // Find all companies Bob works for
  expect(
    p2.links.filter(l => l.type === LINK_EMPLOYEE).map(l => l.source)
  ).toStrictEqual([org1, org2]);

  // Find all employees of Google
  expect(
    org1.links.filter(l => l.type === LINK_EMPLOYEE).map(l => l.target)
  ).toStrictEqual([p1, p2]);
});

test('undirected links', async () => {
  const echo = await createTestInstance({ initialize: true });
  const party = await echo.createParty();

  const alice = await party.database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name: 'Alice' } });
  const bob = await party.database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name: 'Bob' } });
  const charlie = await party.database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name: 'Charlie' } });

  await party.database.createLink({ source: alice, type: LINK_FRIENDS_WITH, target: bob });
  await party.database.createLink({ source: alice, type: LINK_FRIENDS_WITH, target: charlie });

  // Find all fiends of Bob
  expect(
    bob.links.filter(l => l.type === LINK_FRIENDS_WITH).map(l => l.target !== bob ? l.target : l.source)
  ).toStrictEqual([alice]);

  // Find all fiends of Alice
  expect(
    alice.links.filter(l => l.type === LINK_FRIENDS_WITH).map(l => l.target !== alice ? l.target : l.source)
  ).toStrictEqual([bob, charlie]);
});
