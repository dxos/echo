//
// Copyright 2020 DXOS.org
//

import { useEffect, useState } from 'react';

import { createTestInstance, Database } from '@dxos/echo-db';

import { generate } from './testing';

// TODO(burdon): Merge with other hook.
export const useDatabase = () => {
  const [database, setDatabase] = useState<Database | undefined>();

  useEffect(() => {
    setImmediate(async () => {
      const echo = await createTestInstance({ initialize: true });
      const party = await echo.createParty();
      await generate(party.database, {
        numOrgs: 4,
        numPeople: 16,
        numProjects: 6
      });

      // TODO(burdon): ItemList doesn't update if this call is moved ahead of generate.
      setDatabase(party.database);
    });
  }, []);

  return database;
};
