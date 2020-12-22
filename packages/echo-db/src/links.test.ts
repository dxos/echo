//
// Copyright 2020 DXOS.org
//

import { ObjectModel } from '@dxos/object-model';

import { createTestInstance } from './testing/test-utils';

const OBJECT_PERSON = 'dxn:echo.dxos:object/person';
const OBJECT_ORG = 'dxn:echo.dxos:object/org';
const LINK_WORKS_FOR = 'dxn:echo.dxos:link/works-for';
const LINK_FRIENDS_WITH = 'dxn:echo.dxos:link/friends-with';

test('directed links', async () => {
  const echo = await createTestInstance({ initialize: true });
  const party = await echo.createParty();

  const alice = await party.database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name: 'Alice' } });
  const bob = await party.database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name: 'Bob' } });

  const google = await party.database.createItem({ model: ObjectModel, type: OBJECT_ORG, props: { name: 'Google' } });
  const facebook = await party.database.createItem({ model: ObjectModel, type: OBJECT_ORG, props: { name: 'Facebook' } });

  await party.database.createLink({ source: alice, type: LINK_WORKS_FOR, target: google });
  await party.database.createLink({ source: bob, type: LINK_WORKS_FOR, target: google });
  await party.database.createLink({ source: bob, type: LINK_WORKS_FOR, target: facebook });

  // Find all companies Bob works for
  expect(
    bob.xrefs.filter(l => l.type === LINK_WORKS_FOR).map(l => l.to)
  ).toStrictEqual([google, facebook]);

  // Find all employees of Google
  expect(
    google.xrefs.filter(l => l.type === LINK_WORKS_FOR).map(l => l.from)
  ).toStrictEqual([alice, bob]);
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
    bob.xrefs.filter(l => l.type === LINK_FRIENDS_WITH).map(l => l.to !== bob ? l.to : l.from)
  ).toStrictEqual([alice]);

  // Find all fiends of Alice
  expect(
    alice.xrefs.filter(l => l.type === LINK_FRIENDS_WITH).map(l => l.to !== alice ? l.to : l.from)
  ).toStrictEqual([bob, charlie]);
});
