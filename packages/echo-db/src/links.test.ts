//
// Copyright 2020 DXOS.org
//

import { ObjectModel } from '@dxos/object-model';

import { createTestInstance } from './testing/test-utils';

const OBJECT_PERSON = 'dxn:echo.dxos:object/person';
const OBJECT_ORG = 'dxn:echo.dxos:object/org';
const LINK_WORKS_FOR = 'dxn:echo.dxos:link/works-for';

test('directed links', async () => {
  const echo = await createTestInstance({ initialize: true });
  const party = await echo.createParty();

  const alice = await party.database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name: 'Alice' } });
  const bob = await party.database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name: 'Bob' } });

  const google = await party.database.createItem({ model: ObjectModel, type: OBJECT_ORG, props: { name: 'Google' } });
  const facebook = await party.database.createItem({ model: ObjectModel, type: OBJECT_ORG, props: { name: 'Facebook' } });

  await party.database.createLink({ left: alice, type: LINK_WORKS_FOR, right: google });
  await party.database.createLink({ left: bob, type: LINK_WORKS_FOR, right: google });
  await party.database.createLink({ left: bob, type: LINK_WORKS_FOR, right: facebook });

  // Find all companies Bob works for
  expect(
    bob.xrefs.filter(l => l.type === LINK_WORKS_FOR).map(l => l.right)
  ).toStrictEqual([google, facebook]);

  // Find all employees of Google
  expect(
    google.xrefs.filter(l => l.type === LINK_WORKS_FOR).map(l => l.left)
  ).toStrictEqual([alice, bob]);
});
