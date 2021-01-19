//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {},
  icon: {
    width: 48,
    minWidth: 48
  }
}));

export interface ListAdapter {
  icon?: (any) => any // TODO(burdon): Type.
  primary: (any) => string
  secondary: (any) => string
}

export interface ListViewProps {
  items: any[],
  adapter: ListAdapter
}

const ListView = ({ adapter, items = [] }: ListViewProps) => {
  const classes = useStyles();

  return (
    <List dense className={classes.root}>
      {items.map((item) => (
        <ListItem key={item.id}>
          {adapter.icon && (
            <ListItemIcon className={classes.icon}>
              <adapter.icon type={item.type} />
            </ListItemIcon>
          )}
          <ListItemText
            primary={adapter.primary(item)}
            secondary={adapter.secondary(item)}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ListView;
