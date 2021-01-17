//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import React from 'react';
import * as colors from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

import {
  OBJECT_ORG,
  OBJECT_PERSON,
  OBJECT_PROJECT,
  OBJECT_TASK,
  ItemList,
  LinksGraph,
  graphSelector,
  itemSelector,
  useMutator,
  useSelection,
  useTestDatabase
} from '../src';

export default {
  title: 'Links',
  decorators: []
};

const log = debug('dxos:echo:story');

debug.enable('dxos:echo:story:*, dxos:*:error');

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

export const withLinks = () => {
  const classes = useStyles();
  const graphClasses = useGraphStyles();

  const database = useTestDatabase({
    numOrgs: 4,
    numPeople: 16,
    numProjects: 6
  });

  const data = useSelection(database && database.select(), graphSelector);
  const items = useSelection(database && database.select(), itemSelector);
  const mutator = useMutator(database);

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
