//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { teal } from '@material-ui/core/colors';
import {
  Box,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'flex-start'
  },
  card: {
    width: 240,
    height: 240,
    overflow: 'hidden',
    backgroundColor: teal[50],
    margin: 2,
    padding: theme.spacing(1),
    '& h6': {
      lineHeight: 1.2,
      marginBottom: theme.spacing(1)
    }
  }
}));

const GridView = ({ items = [] }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {items.map((item) => {
        const title = item.model.getProperty('name');
        if (!title) {
          return null;
        }

        const description = item.model.getProperty('description');

        return (
          <Box key={item.id} className={classes.card}>
            <Typography variant='h6'>{title}</Typography>
            <Typography variant='body2'>{description}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default GridView;
