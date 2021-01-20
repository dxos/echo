//
// Copyright 2020 DXOS.org
//

import { createTestInstance } from '@dxos/echo-db';

import { Generator, OBJECT_PERSON } from './generator';

test('generator', async () => {
  const echo = await createTestInstance({ initialize: true });
  const party = await echo.createParty();
  const generator = new Generator(party.database, { seed: 100 });
  await generator.generate({
    numPeople: 3
  });

  const selection = party.database.select({ type: OBJECT_PERSON });
  expect(selection.items).toHaveLength(3);

  const names = selection.items.map(item => item.model.getProperty('name'));
  expect(names).toHaveLength(3);

  await echo.close();
});
