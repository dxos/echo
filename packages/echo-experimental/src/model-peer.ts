//
// Copyright 2020 DXOS.org
//

import debug from 'debug';

import { keyToString } from '@dxos/crypto';
import { ObjectModel } from '@dxos/echo-db';
import { FeedReplicationPeer } from '@dxos/feed-replication-network';

const log = debug('dxos:echo-experimental:model-peer');

// This is a class used only in testing.
export class ModelPeer extends FeedReplicationPeer {
  model: any;

  async initializeModel () {
    // TODO(dboreham): Allow specifying model at runtime.
    this.model = new ObjectModel();

    this.model.setAppendHandler(async (message: any) => {
      log(`Sent message: ${JSON.stringify(message)}`);
      await this.feed.append(message);
    });

    // TODO(dboreham): Change to subscription.
    const stream = this.feedStore.createReadStream({ live: true });
    stream.on('data', (message: any) => {
      log(`Received message: ${JSON.stringify(message)}`);
      this.model.processMessages([message.data]);
    });
  }
}

export const ModelPeerFactory = async (topic: Buffer, peerId: Buffer) => {
  log(`Create ModelPeer: ${keyToString(peerId)}`);
  const result = new ModelPeer();
  await result.initialize(topic, peerId);
  await result.initializeModel();
  return result;
};
