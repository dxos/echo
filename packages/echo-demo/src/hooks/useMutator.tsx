//
// Copyright 2020 DXOS.org
//

import faker from 'faker';
import times from 'lodash/times';
import { useEffect, useRef } from 'react';

import { ObjectModel } from '@dxos/object-model';

import {
  LINK_EMPLOYEE,
  LINK_PROJECT,
  OBJECT_ORG,
  OBJECT_PERSON,
  OBJECT_PROJECT,
  OBJECT_TASK
} from '../types';

// TODO(burdon): Configure.
faker.seed(1);

const createProps = type => {
  const generators = {
    [OBJECT_ORG]: () => ({
      name: faker.company.companyName()
    }),
    [OBJECT_PERSON]: () => ({
      name: faker.name.firstName()
    }),
    [OBJECT_PROJECT]: () => ({
      name: faker.commerce.productName()
    }),
    [OBJECT_TASK]: () => ({
      name: faker.git.commitMessage()
    })
  };

  return generators[type]();
};

export const useMutator = (database) => {
  const databaseRef = useRef(database);
  useEffect(() => {
    databaseRef.current = database;
  }, [database]);

  // TODO(burdon): Parameterize.
  const createItem = async (sourceId) => {
    const database = databaseRef.current;
    if (!database) {
      return;
    }

    const source = database.getItem(sourceId);
    if (source.type === OBJECT_ORG) {
      const props = createProps(OBJECT_PERSON);
      const target = await database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props });
      database.createLink({ type: LINK_EMPLOYEE, source, target });
    }
  };

  // TODO(burdon): Parameterize.
  const linkItem = async (sourceId, targetId) => {
    const database = databaseRef.current;
    if (!database) {
      return;
    }

    const source = database.getItem(sourceId);
    const target = database.getItem(targetId);
    if (source.type === OBJECT_ORG && target.type === OBJECT_PERSON) {
      database.createLink({ type: LINK_EMPLOYEE, source, target });
    }
  };

  const generate = async (config) => {
    const database = databaseRef.current;
    if (!database) {
      return;
    }

    // Orgs.
    const organizations = await Promise.all(times(config.numOrgs).map(() =>
      database.createItem({ model: ObjectModel, type: OBJECT_ORG, props: createProps(OBJECT_ORG) })
    ));

    // People.
    await Promise.all(times(config.numPeople).map(async () => {
      const person = await database
        .createItem({ model: ObjectModel, type: OBJECT_PERSON, props: createProps(OBJECT_PERSON) });
      const count = faker.random.number({ min: 0, max: 2 });
      const orgs = faker.random.arrayElements(organizations, count);
      return orgs.map(org => database.createLink({ type: LINK_EMPLOYEE, source: org, target: person }));
    }));

    // Projects.
    await Promise.all(times(config.numProjects).map(async () => {
      const project = await database
        .createItem({ model: ObjectModel, type: OBJECT_PROJECT, props: createProps(OBJECT_PROJECT) });
      const org = faker.random.arrayElement(organizations);
      await database.createLink({ type: LINK_PROJECT, source: org, target: project });

      // Task child nodes.
      // TODO(burdon): Assign to people (query people from org).
      await Promise.all(times(faker.random.number({ min: 0, max: 3 })).map(async () => {
        await database
          .createItem({ model: ObjectModel, type: OBJECT_TASK, props: createProps(OBJECT_TASK), parent: project.id });
      }));
    }));
  };

  return {
    createItem,
    linkItem,
    generate
  };
};
