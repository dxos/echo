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

const ListView = ({ items = [], icon: Icon = undefined }) => {
  const classes = useStyles();

  return (
    <List dense className={classes.root}>
      {items.map((item) => {
        const title = item.model.getProperty('name');
        return title && (
          <ListItem key={item.id}>
            {Icon && (
              <ListItemIcon className={classes.icon}>
                <Icon type={item.type} />
              </ListItemIcon>
            )}
            <ListItemText primary={title} />
          </ListItem>
        );
      })}
    </List>
  );
};

export default ListView;

import OrgIcon from '@material-ui/icons/Business';
import PersonIcon from '@material-ui/icons/Person';

import { OBJECT_ORG, OBJECT_PERSON } from '../types';
