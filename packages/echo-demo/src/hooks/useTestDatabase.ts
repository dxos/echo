//
// Copyright 2020 DXOS.org
//

import { useEffect, useState } from 'react';

import { createTestInstance, Database } from '@dxos/echo-db';

import { useMutator } from './useMutator';

export const useTestDatabase = (config = {}) => {
  const [database, setDatabase] = useState<Database | undefined>();
  const { generate } = useMutator(database);

  useEffect(() => {
    setImmediate(async () => {
      const echo = await createTestInstance({ initialize: true });
      const party = await echo.createParty();
      setDatabase(party.database);
    });
  }, []);

  useEffect(() => {
    setImmediate(async () => {
      await generate(config);
    });
  }, [database]);

  return database;
};
