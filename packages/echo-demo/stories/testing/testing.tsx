//
// Copyright 2020 DXOS.org
//

import { useEffect, useRef } from 'react';
import faker from 'faker';
import times from 'lodash/times';

import { ObjectModel } from '@dxos/object-model';

import {
  LINK_EMPLOYEE,
  LINK_PROJECT,
  OBJECT_ORG,
  OBJECT_PERSON,
  OBJECT_PROJECT,
  OBJECT_TASK,
} from '../../src';

// TODO(burdon): Configure.
faker.seed(1);

export const generate = async (database, config) => {
  // Orgs.
  const organizations = await Promise.all(times(config.numOrgs, () => faker.company.companyName()).map(name =>
    database.createItem({ model: ObjectModel, type: OBJECT_ORG, props: { name } })
  ));

  // People.
  const people = await Promise.all(times(config.numPeople, () => faker.name.firstName()).map(async name => {
    const person = await database.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name } });
    const count = faker.random.number({ min: 0, max: 2 });
    const orgs = faker.random.arrayElements(organizations, count);
    return orgs.map(org => database.createLink({ type: LINK_EMPLOYEE, source: org, target: person }));
  }));

  // Projects.
  await Promise.all(times(config.numProjects, () => faker.commerce.productName()).map(async name => {
    const project = await database.createItem({ model: ObjectModel, type: OBJECT_PROJECT, props: { name } });
    const org = faker.random.arrayElement(organizations);
    await database.createLink({ type: LINK_PROJECT, source: org, target: project });

    // Task child nodes.
    // TODO(burdon): Assign to people (query people from org).
    await Promise.all(times(faker.random.number({ min: 0, max: 3 }), () => faker.git.commitMessage())
      .map(async name => {
        await database.createItem({ model: ObjectModel, type: OBJECT_TASK, props: { name }, parent: project.id });
      }));
  }));
};

// Mutator hook.
export const useMutator = (database) => {
  const ref = useRef(database);
  useEffect(() => { ref.current = database }, [database]);

  // TODO(burdon): Parameterize.
  const createItem = async (sourceId) => {
    const source = ref.current.getItem(sourceId);
    if (source.type === OBJECT_ORG) {
      const name = faker.name.firstName();
      const target = await ref.current.createItem({ model: ObjectModel, type: OBJECT_PERSON, props: { name } });
      ref.current.createLink({ type: LINK_EMPLOYEE, source, target })
    }
  };

  const linkItem = async (sourceId, targetId) => {
    const source = ref.current.getItem(sourceId);
    const target = ref.current.getItem(targetId);
    if (source.type === OBJECT_ORG && target.type === OBJECT_PERSON) {
      ref.current.createLink({ type: LINK_EMPLOYEE, source, target });
    }
  };

  return {
    createItem,
    linkItem
  };
};
