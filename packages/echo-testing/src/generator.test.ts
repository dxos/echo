//
// Copyright 2020 DXOS.org
//

import { createTestInstance } from '@dxos/echo-db';

import { Generator } from './generator';

// TODO(burdon): Should @type defs in package.json be in deps or devDeps?

test('generator', async () => {
  const echo = await createTestInstance({ initialize: true });
  const party = await echo.createParty();
  const generator = new Generator(party.database, { seed: 1 });
  await generator.generate({});

  const selection = party.database.select();
  expect(selection.items).toHaveLength(1);
});
