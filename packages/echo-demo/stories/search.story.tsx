//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import { Chip, IconButton, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import CardIcon from '@material-ui/icons/ViewComfy';
import ListIcon from '@material-ui/icons/Reorder';
import GraphIcon from '@material-ui/icons/BubbleChart';
import GridIcon from '@material-ui/icons/ViewModule';

import OrgIcon from '@material-ui/icons/Business';
import PersonIcon from '@material-ui/icons/PersonOutline';
import ProjectIcon from '@material-ui/icons/WorkOutline';
import DefaultIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import grey from '@material-ui/core/colors/grey';

import {
  CardView, GraphView, ListView, GridView, SearchBar, ItemCard,
  useTestDatabase, useSelection, graphSelector,
  OBJECT_ORG, OBJECT_PERSON, OBJECT_PROJECT, LINK_PROJECT, LINK_EMPLOYEE,
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
    flexShrink: 0,
    padding: theme.spacing(1)
  },
  search: {
    flex: 1
  },
  buttons: {
    paddingLeft: theme.spacing(2)
  },
  content: {
    display: 'flex',
    flex: 1,
    overflow: 'auto',
    margin: theme.spacing(1)
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
  },
  chips: {
    marginTop: theme.spacing(2)
  },
  chip: {
    height: 20,
    padding: 2,
    marginRight: 4,
    borderRadius: 6,
    '& span': {
      paddingLeft: 6,
      paddingRight: 6,
      fontSize: 12
    }
  }
}));

const VIEW_LIST = 1;
const VIEW_CARDS = 2;
const VIEW_GRID = 3;
const VIEW_GRAPH = 4;

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
  const [view, setView] = useState(VIEW_CARDS);

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

    const labels = item.model.getProperty('labels') || {}; // TODO(burdon): Default value in getter.
    const Content = ({ children }) => {
      return (
        <>
          {children}
          {labels && (
            <div className={classes.chips}>
              {Object.values(labels).map((label, i) => (
                <Chip key={i} label={label} className={classes.chip} />
              ))}
            </div>
          )}
        </>
      );
    };

    switch (item.type) {
      case OBJECT_ORG: {
        const projects = item.select().links({ type: LINK_PROJECT }).target().items;
        const employees = item.select().links({ type: LINK_EMPLOYEE }).target().items;
        return (
          <Content>
            {(projects.length !== 0) && (
              <List items={projects} title='Projects' />
            )}
            {(employees.length !== 0) && (
              <List items={employees} title='Employees' />
            )}
          </Content>
        );
      }

      case OBJECT_PROJECT: {
        const tasks = item.select().children().items;
        return (
          <Content>
            {(tasks.length !== 0) && (
              <List items={tasks} title='Tasks' />
            )}
          </Content>
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

  return (
    <div className={classes.root}>
      <Toolbar variant='dense' disableGutters classes={{ root: classes.toolbar }}>
        <SearchBar onUpdate={handleUpdate} />
        <div className={classes.buttons}>
          <ViewButton view={VIEW_LIST} icon={ListIcon} />
          <ViewButton view={VIEW_CARDS} icon={CardIcon} />
          <ViewButton view={VIEW_GRID} icon={GridIcon} />
          <ViewButton view={VIEW_GRAPH} icon={GraphIcon} />
        </div>
      </Toolbar>

      <div className={classes.content}>
        {view === VIEW_LIST && (
          <ListView
            items={items}
            icon={Icon}
          />
        )}
        {view === VIEW_CARDS && (
          <CardView
            items={items}
            icon={Icon}
            CustomContent={ItemContent}
          />
        )}
        {view === VIEW_GRID && (
          <GridView
            items={items}
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
