//
// Copyright 2020 DXOS.org
//

// @ts-ignore
import * as d3 from 'd3';
import debug from 'debug';
// @ts-ignore
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
  useGrid,
// @ts-ignore
} from '@dxos/gem-core';

import {
  useDefaultStyles,
  createArrowMarkers
// @ts-ignore
} from '@dxos/gem-spore';

import { FeedStore } from '@dxos/feed-store';
import { codec, createReplicatorFactory, Database, PartyManager } from '@dxos/experimental-echo-db';
import { ObjectModel } from '@dxos/experimental-object-model';
import { ModelFactory } from '@dxos/experimental-model-factory';
// @ts-ignore
import { randomBytes } from '@dxos/crypto';
// @ts-ignore
import { NetworkManager, SwarmProvider } from '@dxos/network-manager';

import { EchoContext, EchoGraph } from '../src';

const log = debug('dxos:echo:demo');
debug.enable('dxos:echo:demo, dxos:echo:item-manager');

export default {
  title: 'Demo',
  decorators: [withKnobs]
};

const createDatabase = () => {
  const [database] = useState(() => {
    const feedStore = new FeedStore(ram, { feedOptions: { valueEncoding: codec } });

    const modelFactory = new ModelFactory()
      .registerModel(ObjectModel.meta, ObjectModel);

    // TODO(burdon): API: Remove global in-memory swarm.
    const networkManager = new NetworkManager(feedStore, new SwarmProvider());
    const partyManager = new PartyManager(
      feedStore,
      modelFactory,
      createReplicatorFactory(networkManager, feedStore, randomBytes())
    );

    return new Database(partyManager);
  });

  log('Created:', String(database));

  return database;
};

export const withDatabase = () => {
  const db1 = createDatabase();
  const db2 = createDatabase();

  useEffect(() => {
    setImmediate(async () => {
      // Create party and invite.
      const party1 = await db1.createParty();
      log('Created Party:', String(party1));

      // Invite party.
      const invitation = party1.createInvitation();
      log('Invitation request:', invitation.request);

      // Join party.
      const responder = await db2.joinParty(invitation.request);

      // Response.
      log('Invitation response:', invitation.request);
      await invitation.finalize(responder.response);

      // Invited
      const party2 = responder.party;
      log('Invited Party:', String(party2));

      // Create items.
      const item1 = await party1.createItem(ObjectModel.meta.type);
      const item2 = await party1.createItem(ObjectModel.meta.type);
      await item1.addChild(item2);
      log('Created Item:', String(item1));
    });
  }, []);

  return (
    <Test nodes={[
      { id: 'A', database: db1 },
      { id: 'B', database: db2 }
    ]} />
  )
};

export const Test = ({ nodes }) => {
  const classes = useDefaultStyles();
  const [resizeListener, size] = useResizeAware();
  const { width, height } = size;
  const grid = useGrid({ width, height });
  const markers = useRef<SVGGElement>(null);

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

        {nodes.map(({ id, database }, i) => (
          <EchoContext.Provider key={id} value={database}>
            <EchoGraph id={id} grid={grid} dx={-50 + (i * 100 / (nodes.length - 1))} />
          </EchoContext.Provider>
        ))}
      </SVG>
    </FullScreen>
  );
};
