//
// Copyright 2020 DXOS.org
//

import React, { useState, useEffect } from 'react'

import { createTestInstance, Database } from '@dxos/echo-db';
import { ObjectModel } from '@dxos/object-model';

import { LINK_EMPLOYEE, OBJECT_ORG, OBJECT_PERSON, LinksGraph } from '../src';

export default {
  title: 'Links',
  decorators: []
};

export const withLinks = () => {
  const [database, setDatabase] = useState<Database | undefined>();

  useEffect(() => {
    setImmediate(async () => {
      const echo = await createTestInstance({ initialize: true });
      const party = await echo.createParty();

      const p1 = await party.database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name: 'Alice' } });
      const p2 = await party.database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name: 'Bob' } });

      const org1 = await party.database.createItem({ model: ObjectModel, type: OBJECT_ORG, props: { name: 'DXOS' } });
      const org2 = await party.database.createItem({ model: ObjectModel, type: OBJECT_ORG, props: { name: 'ACME' } });

      await party.database.createLink({ source: org1, type: LINK_EMPLOYEE, target: p1 });
      await party.database.createLink({ source: org1, type: LINK_EMPLOYEE, target: p2 });
      await party.database.createLink({ source: org2, type: LINK_EMPLOYEE, target: p2 });

      setDatabase(party.database);
    })
  }, []);

  if (!database) {
    return null;
  }

  return (
    <LinksGraph database={database} />
  )
};
