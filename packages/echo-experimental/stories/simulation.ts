//
// Copyright 2020 DXOS.org
//

import Chance from 'chance';
import debug from 'debug';
import { EventEmitter } from 'events';

import { createId, keyToBuffer, keyToString } from '@dxos/crypto';
import { createReplicationNetwork } from '@dxos/feed-replication-network';

import { ModelPeerFactory } from '../src/model-peer';

const log = debug('dxos:echo:stories');
debug.enable('dxos:echo:stories');

const chance = new Chance();

export enum Connectivity {
  DISCONNECTED,
  CONNECTED,
  SPLIT,
  RANDOM
}

export class Simulation {
  initialized = false;
  network;

  private itemId;
  private type = 'graph.type';
  private eventEmitter = new EventEmitter();
  private nodesCache;
  private continuousMutations = false;

  async initialize () {
    this.network = await createReplicationNetwork({ initializeConnected: true, peerCount: 4 }, ModelPeerFactory);
    // Create a single item to be used for our replication testing (model should exist by now).
    const firstModel = this.network.peers[0].model;
    this.itemId = await firstModel.createItem(this.type, { color: 'black' });
    this.initialized = true;
    this.network.peers.forEach(p => p.model.on('update', () => this.signalUpdate()));
  }

  startMutating () {
    const onInterval = async () => {
      await this.changeNodeColor();
      if (this.continuousMutations) {
        setTimeout(onInterval, 2000);
      }
    };
    setTimeout(onInterval, 2000);
    this.continuousMutations = true;
    this.signalUpdate();
  }

  stopMutating () {
    this.continuousMutations = false;
    this.signalUpdate();
  }

  continuousMutating () {
    return this.continuousMutations;
  }

  async singleMutation () {
    return this.changeNodeColor();
  }

  async changeConnectivity (connectivity: Connectivity) {
    const promises = [];
    const currentPeers = this.network.peers;
    const currentConnections = this.network.connections;

    const connectedNetwork = () => {
      currentPeers.forEach(
        fromPeer => currentPeers.forEach(toPeer => promises.push(this.network.addConnection(fromPeer.id, toPeer.id)))
      );
    };

    const disconnectedNetwork = () => {
      currentConnections.forEach(c => promises.push(this.network.deleteConnection(c.fromPeer.id, c.toPeer.id)));
    };

    const randomNetwork = () => {
      currentConnections.forEach((c) => {
        if (chance.bool()) {
          promises.push(this.network.deleteConnection(c.fromPeer.id, c.toPeer.id));
        }
      });
    };

    const splitNetwork = () => {
      const splitPoint = currentPeers.length / 2;
      const leftHalf = currentPeers.slice(0, splitPoint);
      const rightHalf = currentPeers.slice(splitPoint);
      currentConnections.forEach(c => promises.push(this.network.deleteConnection(c.fromPeer.id, c.toPeer.id)));
      leftHalf.forEach(
        fromPeer => leftHalf.forEach(toPeer => promises.push(this.network.addConnection(fromPeer.id, toPeer.id)))
      );
      rightHalf.forEach(
        fromPeer => rightHalf.forEach(toPeer => promises.push(this.network.addConnection(fromPeer.id, toPeer.id)))
      );
    };

    switch (connectivity) {
      case Connectivity.CONNECTED:
        connectedNetwork();
        break;
      case Connectivity.DISCONNECTED:
        disconnectedNetwork();
        break;
      case Connectivity.SPLIT:
        splitNetwork();
        break;
      case Connectivity.RANDOM:
        randomNetwork();
        break;
    }
    await Promise.all(promises);
    this.signalUpdate();
  }

  async disconnectNode (nodeId) {
    log(`Disconnected: ${nodeId}`);
    const promises = [];
    const currentConnections = this.network.connections;
    currentConnections.forEach((c) => {
      if (keyToString(c.fromPeer.id) === nodeId || keyToString(c.toPeer.id) === nodeId) {
        promises.push(this.network.deleteConnection(c.fromPeer.id, c.toPeer.id));
      }
    });
    await Promise.all(promises);
    this.signalUpdate();
  }

  async addPeer () {
    // For now we always fully connect new peers.
    const promises = [];
    const currentPeers = this.network.peers;
    const newPeer = await this.network.addPeer(keyToBuffer(createId()));
    log(`Added peer: ${keyToString(newPeer.id)}`);
    currentPeers.forEach(fromPeer => promises.push(this.network.addConnection(fromPeer.id, newPeer.id)));
    await Promise.all(promises);
    this.signalUpdate();
  }

  toForceGraph () {
    // TODO(dboreham): Needs to retain previous object since grapher adorns the nodes (only) with its magic.
    // When we generate a new graph to re-render, without that magic it begins the force simulation anew.
    const colorFromPeer = (peer) => {
      const payloadObject = peer.model.getItem(this.itemId);
      return payloadObject ? payloadObject.properties.color : 'black';
    };
    const peers = this.network.peers;
    if (this.nodesCache && this.nodesCache.length === peers.length) {
      // TODO(dboreham): Hack -- won't work if the node order changes.
      for (let i = 0; i < peers.length; i++) {
        this.nodesCache[i].color = colorFromPeer(peers[i]);
      }
    } else {
      this.nodesCache = this.network.peers.map(p => ({ id: keyToString(p.id), color: colorFromPeer(p) }));
    }
    const links = this.network.connections.map(c => ({ source: keyToString(c.fromPeer.id), target: keyToString(c.toPeer.id) }));
    return { nodes: this.nodesCache, links };
  }

  private static randomColor () {
    return chance.pickone(['red', 'blue', 'magenta', 'green', 'cyan', 'yellow', 'teal', 'gray']);
  }

  private randomNode () {
    return chance.pickone(this.network.peers);
  }

  private async changeNodeColor (): Promise<void> {
    const randomModel = this.randomNode().model;
    if (randomModel.getItem(this.itemId)) {
      const selectedNode = this.randomNode();
      const selectedColor = Simulation.randomColor();
      await selectedNode.model.updateItem(this.itemId, { color: selectedColor });
      // TODOO(dboreham): display this text on the screen.
      log(`Changed node: ${selectedNode} color to: ${selectedNode}`);
    } else {
      log('Item not found on node, skipping mutation.');
    }
  }

  private signalUpdate () {
    this.eventEmitter.emit('update');
  }
}
