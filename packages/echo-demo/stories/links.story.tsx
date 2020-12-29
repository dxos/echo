//
// Copyright 2020 DXOS.org
//

import React, { useState, useEffect } from 'react'
import Chance from 'chance';

import { createTestInstance, Database } from '@dxos/echo-db';
import { ObjectModel } from '@dxos/object-model';

import { LINK_EMPLOYEE, OBJECT_ORG, OBJECT_PERSON, LinksGraph } from '../src';

export default {
  title: 'Links',
  decorators: []
};

const chance = new Chance(100);

export const withLinks = () => {
  const [database, setDatabase] = useState<Database | undefined>();

  useEffect(() => {
    setImmediate(async () => {
      const echo = await createTestInstance({ initialize: true });
      const party = await echo.createParty();

      const organizations = await Promise.all(['DXOS', 'Acme', 'Newco'].map(name =>
        party.database.createItem({ model: ObjectModel, type: OBJECT_ORG, props: { name } })
      ));

      const people = await Promise.all(['Alice', 'Bob', 'Charlie', 'Dianne', 'Emiko'].map(name =>
        party.database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name } })
      ));

      await Promise.all(people.flatMap(person => {
        return organizations.map(organization => {
          if (chance.bool({ likelihood: 50 })) {
            return party.database.createLink({ type: LINK_EMPLOYEE, source: organization, target: person })
          }
        }).filter(Boolean);
      }));

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
