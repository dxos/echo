//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import { IconButton, Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GridIcon from '@material-ui/icons/ViewComfy';
import ListIcon from '@material-ui/icons/Reorder';

import { CardView, ItemList, SearchBar, useTestDatabase, useSelection } from '../src';

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
  toolbar: {
    display: 'flex',
    marginBottom: theme.spacing(2)
  },
  search: {
    flex: 1
  },
  buttons: {
    paddingLeft: theme.spacing(2)
  }
}));

const VIEW_LIST = 1;
const VIEW_CARDS = 2;

export const withSearch = () => {
  const classes = useStyles();
  const database = useTestDatabase({
    numOrgs: 10,
    numPeople: 20
  });
  const [search, setSearch] = useState(undefined);
  const items = useSelection(database && database.select(), searchSelector(search), [search]);
  const [view, setView] = useState(VIEW_CARDS);

  const handleUpdate = text => setSearch(text.toLowerCase());

  return (
    <div>
      <Toolbar variant='dense' disableGutters classes={{ root: classes.toolbar }}>
        <SearchBar onUpdate={handleUpdate} />
        <div className={classes.buttons}>
          <IconButton color={view === VIEW_LIST ? 'primary' : 'default'} size='small' onClick={() => setView(VIEW_LIST)}>
            <ListIcon />
          </IconButton>
          <IconButton color={view === VIEW_CARDS ? 'primary' : 'default'} size='small' onClick={() => setView(VIEW_CARDS)}>
            <GridIcon />
          </IconButton>
        </div>
      </Toolbar>

      {view === VIEW_LIST && (
        <ItemList items={items} />
      )}
      {view === VIEW_CARDS && (
        <CardView items={items} />
      )}
    </div>
  );
};
