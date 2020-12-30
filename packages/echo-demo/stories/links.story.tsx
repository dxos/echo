//
// Copyright 2020 DXOS.org
//

import React, { useState, useEffect, useRef } from 'react';
import Chance from 'chance';
import debug from 'debug';
import times from 'lodash/times';

import { createTestInstance, Database } from '@dxos/echo-db';
import { ObjectModel } from '@dxos/object-model';

import { LINK_EMPLOYEE, OBJECT_ORG, OBJECT_PERSON, LinksGraph, graphSelector, useSelection } from '../src';

export default {
  title: 'Links',
  decorators: []
};

debug.enable('dxos:testing:*');

const chance = new Chance(100);

const useMutator = (database) => {
  const ref = useRef(database);
  useEffect(() => { ref.current = database }, [database]);

  const createItem = async (sourceId) => {
    const source = ref.current.getItem(sourceId);
    if (source.type === OBJECT_ORG) {
      const name = chance.first();
      const target = await ref.current.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name } });
      ref.current.createLink({ type: LINK_EMPLOYEE, source, target })
    }
  };

  const linkItem = async (sourceId, targetId) => {
    const source = ref.current.getItem(sourceId);
    const target = ref.current.getItem(targetId);
    if (source.type === OBJECT_ORG && target.type === OBJECT_PERSON) {
      ref.current.createLink({ type: LINK_EMPLOYEE, source, target })
    }
  };

  return {
    createItem,
    linkItem
  };
};

export const withLinks = () => {
  const [database, setDatabase] = useState<Database | undefined>();
  const data = useSelection(database && database.select(), graphSelector, []);
  const mutator = useMutator(database);

  useEffect(() => {
    setImmediate(async () => {
      const echo = await createTestInstance({ initialize: true });
      const party = await echo.createParty();

      const organizations = await Promise.all(times(3, () => chance.company()).map(name =>
        party.database.createItem({ model: ObjectModel, type: OBJECT_ORG, props: { name } })
      ));

      const people = await Promise.all(times(5, () => chance.first()).map(name =>
        party.database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name } })
      ));

      await Promise.all(people.flatMap(person => {
        return organizations.map(organization => {
          if (chance.bool({ likelihood: 40 })) {
            return party.database.createLink({ type: LINK_EMPLOYEE, source: organization, target: person })
          }
        }).filter(Boolean);
      }));

      setDatabase(party.database);
    });
  }, []);

  const handleCreate = data => {
    if (!data.nodes.length) {
      const { source, target } = data.links[0];
      mutator.linkItem(source, target);
    } else {
      const { source } = data.links[0];
      mutator.createItem(source);
    }
  };

  return (
    <LinksGraph data={data} onCreate={handleCreate} />
  );
};
