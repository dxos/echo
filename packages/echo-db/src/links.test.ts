//
// Copyright 2020 DXOS.org
//

import { ObjectModel } from '@dxos/object-model';

import { createTestInstance } from './testing/test-utils';

const OBJECT_PERSON = 'wrn://dxos/object/person';
const OBJECT_ORG = 'wrn://dxos/object/org';
const LINK_EMPLOYEE = 'wrn://dxos/link/employee';
const LINK_FRIENDS_WITH = 'wrn://dxos/link/friends-with';

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

  const p1 = await party.database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name: 'Alice' } });
  const p2 = await party.database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name: 'Bob' } });
  const p3 = await party.database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name: 'Charlie' } });

  await party.database.createLink({ source: p1, type: LINK_FRIENDS_WITH, target: p2 });
  await party.database.createLink({ source: p1, type: LINK_FRIENDS_WITH, target: p3 });

  // Find all fiends of Bob
  expect(
    p2.links.filter(l => l.type === LINK_FRIENDS_WITH).map(l => l.target !== p2 ? l.target : l.source)
  ).toStrictEqual([p1]);

  // Find all fiends of Alice
  expect(
    p1.links.filter(l => l.type === LINK_FRIENDS_WITH).map(l => l.target !== p1 ? l.target : l.source)
  ).toStrictEqual([p2, p3]);
});
