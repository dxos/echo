//
// Copyright 2020 DXOS.org
//

// @ts-ignore
import * as d3 from 'd3';
import debug from 'debug';
import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import ram from 'random-access-memory';
// @ts-ignore
import useResizeAware from 'react-resize-aware';
import { withKnobs, button } from '@storybook/addon-knobs';

// @ts-ignore
import {
  FullScreen,
  Grid,
  SVG,
  createTree,
  convertTreeToGraph,
  useGrid,
  useObjectMutator
// @ts-ignore
} from '@dxos/gem-core';

import {
  Graph,
  ForceLayout,
  NodeProjector,
  LinkProjector,
  useDefaultStyles,
  createArrowMarkers
// @ts-ignore
} from '@dxos/gem-spore';

import { FeedStore } from '@dxos/feed-store';
import { codec, Database, PartyManager } from '@dxos/experimental-echo-db';
import { ObjectModel } from '@dxos/experimental-object-model';
import { ModelFactory } from '@dxos/experimental-model-factory';
import { createReplicatorFactory } from '@dxos/experimental-echo-db/dist/src/replication';
// @ts-ignore
import { randomBytes } from '@dxos/crypto';
// @ts-ignore
import { NetworkManager, SwarmProvider } from '@dxos/network-manager';
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
  const [database] = useState(() => { 
    const feedStore = new FeedStore(ram, { feedOptions: { valueEncoding: codec } });

    const modelFactory = new ModelFactory()
      .registerModel(ObjectModel.meta, ObjectModel);
    
    // TODO: Remove global in-memory swarm
    const networkManager = new NetworkManager(feedStore, new SwarmProvider());
    const partyManager = new PartyManager(
      feedStore,
      modelFactory,
      createReplicatorFactory(networkManager, feedStore, randomBytes()),
    );
    return new Database(partyManager);
  });
  return database;
};

// TODO(burdon): Factor out.
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

  // TODO(burdon): Create data on UX event.
  useEffect(() => {
    setImmediate(async () => {
      await database.open();
      const parties = database.queryParties();
      console.log(parties);
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

  // TODO(burdon): Connect database instances via in-memory replicator.
  // TODO(burdon): Create party and invite both nodes here.
  const database1 = useDatabase();
  const database2 = useDatabase();

  useEffect(() => {
    setImmediate(async () => {
      const party1 = await database1.createParty();
      const inviter = party1.createInvitation();
      const responder = await database2.joinParty(inviter.invitation);
      inviter.finalize(responder.response);
      const party2 = responder.party;

      const item = await party1.createItem(ObjectModel.meta.type);

      const result = await party2.queryItems();
      result.subscribe(console.log)
    });
  }, []);

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
