//
// Copyright 2020 DXOS.org
//

import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as colors from '@material-ui/core/colors';
import debug from 'debug';
import faker from 'faker';
import times from 'lodash/times';

import { createTestInstance, Database } from '@dxos/echo-db';
import { ObjectModel } from '@dxos/object-model';

import {
  LINK_EMPLOYEE,
  LINK_PROJECT,
  OBJECT_ORG,
  OBJECT_PERSON,
  OBJECT_PROJECT,
  OBJECT_TASK,
  ItemList,
  LinksGraph,
  graphSelector,
  itemSelector,
  useSelection
} from '../src';

export default {
  title: 'Links',
  decorators: []
};

const log = debug('dxos:echo:story');

debug.enable('dxos:echo:story:*, dxos:*:error');

faker.seed(1);

const propertyAdapter = (node) => ({
  class: node.type.split('/').pop(),
  radius: {
    [OBJECT_ORG]: 16,
    [OBJECT_PROJECT]: 12,
    [OBJECT_PERSON]: 8,
    [OBJECT_TASK]: 6
  }[node.type] || 8
});

const useStyles = makeStyles(() => ({
  items: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    top: 0,
    bottom: 0,
    overflow: 'scroll',

    color: colors['grey'][700],
    '& .org': {
      color: colors['blue'][700]
    },
    '& .project': {
      color: colors['orange'][700]
    },
    '& .task': {
      color: colors['pink'][700]
    },
    '& .person': {
      color: colors['green'][700]
    }
  },
  info: {
    position: 'absolute',
    zIndex: 1,
    right: 16,
    fontFamily: 'monospace',
    color: colors['grey'][700]
  }
}));

const useGraphStyles = makeStyles(() => ({
  nodes: {
    '& g.node text': {
      fill: colors['grey'][700],
      fontFamily: 'sans-serif',
      fontSize: 12
    },
    '& g.node.org circle': {
      fill: colors['blue'][300],
      stroke: colors['blue'][700],
      strokeWidth: 3
    },
    '& g.node.project circle': {
      fill: colors['orange'][300],
      stroke: colors['orange'][700],
      strokeWidth: 2
    },
    '& g.node.task circle': {
      fill: colors['pink'][300],
      stroke: colors['pink'][700],
      strokeWidth: 2
    },
    '& g.node.person circle': {
      fill: colors['green'][300],
      stroke: colors['green'][700],
      strokeWidth: 1
    }
  }
}));

const generate = async (database, config) => {
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
const useMutator = (database) => {
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

export const withLinks = () => {
  const classes = useStyles();
  const graphClasses = useGraphStyles();
  const [database, setDatabase] = useState<Database | undefined>();
  const data = useSelection(database && database.select(), graphSelector);
  const items = useSelection(database && database.select(), itemSelector);
  const mutator = useMutator(database);

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

  const handleCreate = data => {
    if (data.nodes.length) {
      const { source } = data.links[0];
      mutator.createItem(source);
    } else {
      const { source, target } = data.links[0];
      mutator.linkItem(source, target);
    }
  };

  return (
    <>
      <div className={classes.items}>
        <ItemList items={items} />
      </div>

      <div className={classes.info}>
        <div>Command-drag: Org &#x2192; Person</div>
      </div>

      <LinksGraph
        classes={graphClasses}
        data={data}
        onCreate={handleCreate}
        propertyAdapter={propertyAdapter}
      />
    </>
  );
};
