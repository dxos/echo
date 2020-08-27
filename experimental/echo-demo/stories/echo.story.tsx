//
// Copyright 2020 DXOS.org
//

import * as d3 from 'd3';
import debug from 'debug';
import React, { useEffect, useRef, useState } from 'react';
import ram from 'random-access-memory';
import useResizeAware from 'react-resize-aware';
import { withKnobs, button } from '@storybook/addon-knobs';

import {
  FullScreen,
  Grid,
  SVG,
  createTree,
  convertTreeToGraph,
  useGrid,
  useObjectMutator
} from '@dxos/gem-core';

import {
  Graph,
  ForceLayout,
  NodeProjector,
  LinkProjector,
  useDefaultStyles,
  createArrowMarkers
} from '@dxos/gem-spore';

import { FeedStore } from '@dxos/feed-store';
import { codec, Database } from '@dxos/experimental-echo-db';
import { ObjectModel } from '@dxos/experimental-object-model';
import { ModelFactory } from '@dxos/experimental-model-factory';

debug.enable('dxos:*');

export default {
  title: 'Experimental',
  decorators: [withKnobs]
};

const useDataButton = (generate: Function, label = 'Refresh') => {
  const [data, setData, getData, updateData] = useObjectMutator(generate());
  button(label, () => setData(generate()));
  return [data, setData, getData, updateData];
};

const useDatabase = () => {
  const feedStore = new FeedStore(ram, { feedOptions: { valueEncoding: codec } });

  const modelFactory = new ModelFactory()
    .registerModel(ObjectModel.meta, ObjectModel);

  return new Database(feedStore, modelFactory);
};

export const withDatabase = () => {
  const classes = useDefaultStyles();
  const [resizeListener, size] = useResizeAware();
  const { width, height } = size;
  const grid = useGrid({ width, height });
  const markers = useRef<SVGGElement>(null);

  // TODO(burdon): Render parties and items.
  const database = useDatabase();

  const [data] = useDataButton(() => convertTreeToGraph(createTree(4)));
  const [layout] = useState(new ForceLayout());
  const [{ nodeProjector, linkProjector }] = useState({
    nodeProjector: new NodeProjector({ node: { radius: 16, showLabels: false } }),
    linkProjector: new LinkProjector({ nodeRadius: 16, showArrows: true })
  });

  // Arrows markers.
  useEffect(() => {
    d3.select(markers.current)
      .call(createArrowMarkers());
  }, []);

  // TODO(burdon): Create data.
  useEffect(() => {
    setImmediate(async () => {
      await database.open();
      const party = await database.createParty();
      const parties = database.queryParties();
      console.log(party, parties);
    });
  }, []);

  return (
    <FullScreen>
      {resizeListener}
      <SVG width={width} height={height}>
        <Grid grid={grid} />

        <g ref={markers} className={classes.markers} />

        <Graph
          grid={grid}
          data={data}
          layout={layout}
          nodeProjector={nodeProjector}
          linkProjector={linkProjector}
        />
      </SVG>
    </FullScreen>
  );
};
