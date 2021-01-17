//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
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
  cardContent: {
    height: 100
  },
  nowrap: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}));

const CardView = ({ items = [] }) => {
  const classes = useStyles();

  return (
    <Grid container spacing={2} className={classes.root}>
      {items.map((item) => {
        const title = item.model.getProperty('name');
        const description = item.model.getProperty('description');
        return title && (
          <Grid item key={item.id}>
            <Card className={classes.card}>
              <CardActionArea>
                {/*
              <CardMedia
                className={classes.media}
                image="/static/images/cards/contemplative-reptile.jpg"
                title="Contemplative Reptile"
              />
              */}
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2" className={classes.nowrap}>
                    {title}
                  </Typography>
                  <Typography component="p">
                    {description}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button size="small" color="primary">
                  Info
                </Button>
              </CardActions>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  );
};

export default CardView;
