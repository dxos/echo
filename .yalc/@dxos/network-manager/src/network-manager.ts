//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { PublicKey } from '@dxos/crypto';
import { Protocol } from '@dxos/protocol';
import { ComplexMap } from '@dxos/util';

import { InMemorySignalManager } from './signal/in-memory-signal-manager';
import { SignalManager } from './signal/interface';
import { SignalApi } from './signal/signal-api';
import { WebsocketSignalManager } from './signal/websocket-signal-manager';
import { SwarmMapper } from './swarm-mapper';
import { Swarm } from './swarm/swarm';
import { Topology } from './topology/topology';

export type ProtocolProvider = (opts: { channel: Buffer }) => Protocol;

export interface NetworkManagerOptions {
  signal?: string[],
}

export class NetworkManager {
  private readonly _swarms = new ComplexMap<PublicKey, Swarm>(x => x.toHex());

  private readonly _maps = new ComplexMap<PublicKey, SwarmMapper>(x => x.toHex());

  private readonly _signal: SignalManager;

  get signal () {
    return this._signal;
  }

  constructor (options: NetworkManagerOptions = {}) {
    const onOffer = async (msg: SignalApi.SignalMessage) => (await this._swarms.get(msg.topic)?.onOffer(msg)) ?? { accept: false };

    this._signal = options.signal
      ? new WebsocketSignalManager(options.signal, onOffer)
      : new InMemorySignalManager(onOffer);

    this._signal.peerCandidatesChanged.on(([topic, candidates]) => this._swarms.get(topic)?.onPeerCandidatesChanged(candidates));
    this._signal.onSignal.on(msg => this._swarms.get(msg.topic)?.onSignal(msg));
  }

  // TODO(marik-d): Remove.
  async start () {
    if (this._signal instanceof WebsocketSignalManager) {
      await this._signal.connect();
    }
  }

  getSwarmMap (topic: PublicKey): SwarmMapper | undefined {
    return this._maps.get(topic);
  }

  getSwarm (topic: PublicKey): Swarm | undefined {
    return this._swarms.get(topic);
  }

  joinProtocolSwarm (options: SwarmOptions) {
    assert(typeof options === 'object', 'Incorrect arguments format.');
    const { topic, peerId, topology, protocol, presence } = options;
    assert(PublicKey.isPublicKey(topic), 'Incorrect arguments format.');
    assert(PublicKey.isPublicKey(peerId), 'Incorrect arguments format.');
    assert(topology, 'Incorrect arguments format.');
    assert(typeof protocol === 'function', 'Incorrect arguments format.');

    if (this._swarms.has(topic)) {
      throw new Error(`Already connected to swarm ${topic}`);
    }

    const swarm = new Swarm(
      topic,
      peerId,
      topology,
      protocol,
      async offer => this._signal.offer(offer),
      async msg => this._signal.signal(msg),
      () => {
        this._signal.lookup(topic);
      },
      this._signal instanceof InMemorySignalManager
    );
    this._swarms.set(topic, swarm);
    this._signal.join(topic, peerId);
    this._maps.set(topic, new SwarmMapper(swarm, presence));

    return () => this.leaveProtocolSwarm(topic);
  }

  async leaveProtocolSwarm (topic: PublicKey) {
    if (!this._swarms.has(topic)) {
      return;
    }

    const map = this._maps.get(topic)!;
    const swarm = this._swarms.get(topic)!;

    this._signal.leave(topic, swarm.ownPeerId);

    map.destroy();
    this._maps.delete(topic);

    await swarm.destroy();
    this._swarms.delete(topic);
  }
}

export interface SwarmOptions {
  /**
   * Swarm topic.
   */
  topic: PublicKey,
  /**
   * This node's peer id.
   */
  peerId: PublicKey,

  /**
   * Requested topology. Must be a new instance for every swarm.
   */
  topology: Topology,

  /**
   * Protocol to use for every connection.
   */
  protocol: ProtocolProvider,

  /**
   * Presence plugin for network mapping, if exists.
   */
  presence?: any /* Presence */
}
