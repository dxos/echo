//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import {
  Button,
  Card,
  CardActions,
  CardContent, CardHeader,
  Grid,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex'
  },
  card: {
    width: 280
  },
  header: {
    backgroundColor: grey[200]
  },
  description: {
    maxHeight: 72
  },
  nowrap: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}));

export const ItemCard = ({ item, icon: Icon = undefined, CustomContent = undefined }) => {
  const classes = useStyles();

  const title = item.model.getProperty('name');
  const description = item.model.getProperty('description');

  return (
    <Card classes={{ root: classes.card }}>
      <CardHeader
        classes={{ root: classes.header, content: classes.nowrap, title: classes.nowrap }}
        avatar={
          Icon && (
            <Icon type={item.type} />
          )
        }
        title={title}
        titleTypographyProps={{ variant: 'h6' }}
      />
      <CardContent>
        {description && (
          <Typography component="p" className={classes.description}>
            {description}
          </Typography>
        )}
        {CustomContent && <CustomContent item={item} />}
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          Info
        </Button>
      </CardActions>
    </Card>
  );
};

const CardView = ({ items = [], icon: Icon = undefined, CustomContent = undefined }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={2} className={classes.root}>
      {items.map((item) => {
        const title = item.model.getProperty('name');
        if (!title) {
          return null;
        }

        return (
          <Grid item key={item.id}>
            <ItemCard item={item} icon={Icon} CustomContent={CustomContent} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default CardView;
