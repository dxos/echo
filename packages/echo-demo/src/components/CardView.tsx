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
    width: 300
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

const CardView = ({ items = [], icon: Icon = undefined, CustomContent = undefined }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={2} className={classes.root}>
      {items.map((item) => {
        const title = item.model.getProperty('name');
        if (!title) {
          return null;
        }

        const description = item.model.getProperty('description');
        return (
          <Grid item key={item.id}>
            <Card classes={{ root: classes.card }}>
              <CardHeader
                classes={{ root: classes.header }}
                avatar={
                  Icon && (
                    <Icon type={item.type} />
                  )
                }
                title={title}
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
          </Grid>
        );
      })}
    </Grid>
  );
};

export default CardView;
