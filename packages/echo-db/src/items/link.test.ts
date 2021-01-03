//
// Copyright 2020 DXOS.org
//

import { ObjectModel } from '@dxos/object-model';

import { createTestInstance } from '../testing/test-utils';

const OBJECT_ORG = 'wrn://dxos/object/org';
const OBJECT_PERSON = 'wrn://dxos/object/person';
const LINK_EMPLOYEE = 'wrn://dxos/link/employee';

test('directed links', async () => {
  const echo = await createTestInstance({ initialize: true });
  const { database } = await echo.createParty();

  const p1 = await database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name: 'Person-1' } });
  const p2 = await database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name: 'Person-2' } });

  const org1 = await database.createItem({ model: ObjectModel, type: OBJECT_ORG, props: { name: 'Org-1' } });
  const org2 = await database.createItem({ model: ObjectModel, type: OBJECT_ORG, props: { name: 'Org-2' } });

  await database.createLink({ source: org1, type: LINK_EMPLOYEE, target: p1 });
  await database.createLink({ source: org1, type: LINK_EMPLOYEE, target: p2 });
  await database.createLink({ source: org2, type: LINK_EMPLOYEE, target: p2 });

  // Find all employees for org.
  expect(
    org1.links.filter(link => link.type === LINK_EMPLOYEE).map(link => link.target)
  ).toStrictEqual([p1, p2]);

  // Find all orgs for person.
  expect(
    p2.refs.filter(link => link.type === LINK_EMPLOYEE).map(link => link.source)
  ).toStrictEqual([org1, org2]);
});
