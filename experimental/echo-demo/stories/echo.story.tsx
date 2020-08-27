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

const GraphComponent = ({ grid, database, dx }: { grid: any, database: any, dx: number }) => {
  const [layout] = useState(new ForceLayout({
    center: (grid: any) => ({ x: grid.center.x + grid.scaleX(dx), y: grid.center.y })
  }));
  const [{ nodeProjector, linkProjector }] = useState({
    nodeProjector: new NodeProjector({ node: { radius: 16, showLabels: false } }),
    linkProjector: new LinkProjector({ nodeRadius: 16, showArrows: true })
  });

  // TODO(burdon): Generate data from database.
  const [data] = useDataButton(() => convertTreeToGraph(createTree(4)));

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
    <Graph
      grid={grid}
      data={data}
      layout={layout}
      nodeProjector={nodeProjector}
      linkProjector={linkProjector}
    />
  );
};

export const withDatabase = () => {
  const classes = useDefaultStyles();
  const [resizeListener, size] = useResizeAware();
  const { width, height } = size;
  const grid = useGrid({ width, height });
  const markers = useRef<SVGGElement>(null);

  // TODO(burdon): Connect via in-memory replicator.
  const database1 = useDatabase();
  const database2 = useDatabase();

  // Arrows markers.
  useEffect(() => {
    d3.select(markers.current)
      .call(createArrowMarkers());
  }, []);

  return (
    <FullScreen>
      {resizeListener}
      <SVG width={width} height={height}>
        <Grid grid={grid} />

        <g ref={markers} className={classes.markers} />

        <GraphComponent database={database1} grid={grid} dx={-50} />
        <GraphComponent database={database2} grid={grid} dx={+50} />
      </SVG>
    </FullScreen>
  );
};
