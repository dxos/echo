//
// Copyright 2020 DXOS.org
//

import debug from 'debug';
import React, { useEffect, useRef, useState } from 'react';
import ram from 'random-access-memory';

import useResizeAware from 'react-resize-aware';
import { withKnobs, button } from '@storybook/addon-knobs';

import {
  FullScreen,
  Grid,
  SVG,
  useGrid,
} from '@dxos/gem-core';

import {
  Markers
} from '@dxos/gem-spore';

import { FeedStore } from '@dxos/feed-store';
import { codec, createReplicatorFactory, Database, PartyManager } from '@dxos/experimental-echo-db';
import { ObjectModel } from '@dxos/experimental-object-model';
import { ModelFactory } from '@dxos/experimental-model-factory';
import { randomBytes } from '@dxos/crypto';
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
      log('Invitation response:', responder.response);
      await invitation.finalize(responder.response);

      // Invited
      const party2 = responder.party;
      await party2.open();
      log('Invited Party:', String(party2));
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
  const [resizeListener, size] = useResizeAware();
  const { width, height } = size;
  const grid = useGrid({ width, height });

  return (
    <FullScreen>
      {resizeListener}
      <SVG width={width} height={height}>
        <Grid grid={grid} />
        <Markers />

        {nodes.map(({ id, database }, i) => (
          <EchoContext.Provider key={id} value={{ database }}>
            <EchoGraph id={id} grid={grid} dx={-50 + (i * 100 / (nodes.length - 1))} />
          </EchoContext.Provider>
        ))}
      </SVG>
    </FullScreen>
  );
};
