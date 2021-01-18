//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import { IconButton, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import GridIcon from '@material-ui/icons/ViewComfy';
import ListIcon from '@material-ui/icons/Reorder';
import OrgIcon from '@material-ui/icons/Business';
import PersonIcon from '@material-ui/icons/Person';
import GraphIcon from '@material-ui/icons/Share';
import grey from '@material-ui/core/colors/grey';

import {
  CardView, GraphView, ListView, SearchBar,
  useTestDatabase, useSelection,
  OBJECT_ORG, OBJECT_PERSON, LINK_PROJECT, LINK_EMPLOYEE, graphSelector
} from '../src';

export default {
  title: 'Search'
};

// TODO(burdon): Create index.
const searchSelector = search => selection => {
  const items = [];

  const match = (pattern, text) => {
    if (!pattern) {
      return true;
    }

    if (!text) {
      return false;
    }

    // TODO(burdon): Prefix match.
    return text.toLowerCase().indexOf(pattern) !== -1;
  };

  selection.each(item => {
    const text = item.model.getProperty('name'); // TODO(burdon): Generalize.
    if (match(search, text)) {
      items.push(item);
    }
  });

  return items;
};

const useStyles = makeStyles(theme => ({
  // TODO(burdon): Container.
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100vh',
    backgroundColor: grey[50]
  },
  toolbar: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1)
  },
  search: {
    flex: 1
  },
  buttons: {
    paddingLeft: theme.spacing(2)
  },
  // TODO(burdon): Scroll.
  content: {
    display: 'flex',
    flex: 1,
    overflow: 'auto',
    padding: theme.spacing(1)
  },
  sublist: {
    marginTop: theme.spacing(1)
  }
}));

const VIEW_LIST = 1;
const VIEW_CARDS = 2;
const VIEW_GRAPH = 3;

const icons = {
  [OBJECT_ORG]: OrgIcon,
  [OBJECT_PERSON]: PersonIcon
};

export const withSearch = () => {
  const classes = useStyles();
  const database = useTestDatabase({
    numOrgs: 10,
    numPeople: 20,
    numProjects: 20,
    numTasks: 30
  });
  const [search, setSearch] = useState(undefined);
  const items = useSelection(database && database.select(), searchSelector(search), [search]);
  // TODO(burdon): Use subset.
  // console.log(items);
  // const data = useSelection(items && new Selection(items, new Event()), graphSelector);
  const data = useSelection(database && database.select(), graphSelector);
  const [view, setView] = useState(VIEW_CARDS);

  const handleUpdate = text => setSearch(text.toLowerCase());

  const customContent = item => {
    switch (item.type) {
      case OBJECT_ORG: {
        const projects = item.select().links({ type: LINK_PROJECT }).target().items;
        const employees = item.select().links({ type: LINK_EMPLOYEE }).target().items;
        return (
          <>
            {(projects.length !== 0) && (
              <div className={classes.sublist}>
                <Typography variant='caption'>Projects</Typography>
                {projects.map(item => (
                  <Typography key={item.id} variant='body2'>
                    {item.model.getProperty('name')}
                  </Typography>
                ))}
              </div>
            )}
            {(employees.length !== 0) && (
              <div className={classes.sublist}>
                <Typography variant='caption'>Employees</Typography>
                {employees.map(item => (
                  <Typography key={item.id} variant='body2'>
                    {item.model.getProperty('name')}
                  </Typography>
                ))}
              </div>
            )}
          </>
        );
      }
    }
  };

  const ViewButton = ({ view: type, icon: Icon }) => (
    <IconButton color={type === view ? 'primary' : 'default'} size='small' onClick={() => setView(type)}>
      <Icon />
    </IconButton>
  );

  return (
    <div className={classes.root}>
      <Toolbar variant='dense' disableGutters classes={{ root: classes.toolbar }}>
        <SearchBar onUpdate={handleUpdate} />
        <div className={classes.buttons}>
          <ViewButton view={VIEW_LIST} icon={ListIcon} />
          <ViewButton view={VIEW_CARDS} icon={GridIcon} />
          <ViewButton view={VIEW_GRAPH} icon={GraphIcon} />
        </div>
      </Toolbar>

      <div className={classes.content}>
        {view === VIEW_LIST && (
          <ListView
            items={items}
            icons={icons}
          />
        )}
        {view === VIEW_CARDS && (
          <CardView
            items={items}
            icons={icons}
            customConent={customContent}
          />
        )}
        {view === VIEW_GRAPH && (
          <GraphView
            data={data}
          />
        )}
      </div>
    </div>
  );
};
