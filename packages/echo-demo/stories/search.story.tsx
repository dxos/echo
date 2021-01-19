//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import { IconButton, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import GridIcon from '@material-ui/icons/ViewComfy';
import ListIcon from '@material-ui/icons/Reorder';
import GraphIcon from '@material-ui/icons/BubbleChart';

import OrgIcon from '@material-ui/icons/Business';
import PersonIcon from '@material-ui/icons/PersonOutline';
import ProjectIcon from '@material-ui/icons/WorkOutline';
import DefaultIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import grey from '@material-ui/core/colors/grey';

import {
  CardView, GraphView, ListView, ListAdapter, SearchBar, ItemCard,
  useTestDatabase, useSelection, graphSelector, searchSelector,
  OBJECT_ORG, OBJECT_PERSON, OBJECT_PROJECT, LINK_PROJECT, LINK_EMPLOYEE,
} from '../src';

export default {
  title: 'Search'
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
    padding: theme.spacing(1),

    '& g.selected circle': {
      fill: 'red'
    }
  },
  sublist: {
    marginTop: theme.spacing(1),
    '& table': {
      tableLayout: 'fixed',
      borderCollapse: 'collapse',
      borderSpacing: 0
    }
  },
  subheader: {
    color: theme.palette.info.dark
  },
  card: {
    position: 'absolute',
    zIndex: 100
  }
}));

const VIEW_LIST = 1;
const VIEW_CARDS = 2;
const VIEW_GRAPH = 3;

const icons = {
  [OBJECT_ORG]: OrgIcon,
  [OBJECT_PERSON]: PersonIcon,
  [OBJECT_PROJECT]: ProjectIcon
};

const Icon = ({ type }) => {
  const Icon = icons[type] || DefaultIcon;
  if (!Icon) {
    return null;
  }

  return <Icon />;
};

const listAdapter: ListAdapter = {
  icon: Icon,
  primary: item => item.model.getProperty('name'),
  secondary: item => item.model.getProperty('description')
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
  const [selected, setSelected] = useState();
  const [view, setView] = useState(VIEW_LIST);

  const handleUpdate = text => setSearch(text.toLowerCase());

  const ItemContent = ({ item }) => {
    const List = ({ items, title }) => (
      <div className={classes.sublist}>
        <Typography variant='caption' className={classes.subheader}>{title}</Typography>
        <table>
          <tbody>
            {items.map(item => (
              <tr key={item.id} >
                <td>
                  <Typography variant='body2'>&#x2022;</Typography>
                </td>
                <td>
                  <Typography variant='body2'>
                    {item.model.getProperty('name')}
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    switch (item.type) {
      case OBJECT_ORG: {
        const projects = item.select().links({ type: LINK_PROJECT }).target().items;
        const employees = item.select().links({ type: LINK_EMPLOYEE }).target().items;
        return (
          <>
            {(projects.length !== 0) && (
              <List items={projects} title='Projects' />
            )}
            {(employees.length !== 0) && (
              <List items={employees} title='Employees' />
            )}
          </>
        );
      }
      case OBJECT_PROJECT: {
        const tasks = item.select().children().items;
        return (
          <>
            {(tasks.length !== 0) && (
              <List items={tasks} title='Tasks' />
            )}
          </>
        );
      }
    }

    return null;
  };

  const ViewButton = ({ view: type, icon: Icon }) => (
    <IconButton color={type === view ? 'primary' : 'default'} size='small' onClick={() => setView(type)}>
      <Icon />
    </IconButton>
  );

  // TODO(burdon): Show/hide components to maintain state. Show for first time on select.
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
            adapter={listAdapter}
            items={items}
          />
        )}
        {view === VIEW_CARDS && (
          <CardView
            items={items}
            icon={Icon}
            CustomContent={ItemContent}
          />
        )}
        {view === VIEW_GRAPH && (
          <>
            {selected && (
              <div className={classes.card}>
                <ItemCard
                  item={selected}
                  icon={Icon}
                  CustomContent={ItemContent}
                />
              </div>
            )}
            <GraphView
              data={data}
              onSelect={id => setSelected(items.find(item => item.id === id))}
            />
          </>
        )}
      </div>
    </div>
  );
};
