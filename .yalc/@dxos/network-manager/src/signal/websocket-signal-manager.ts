//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';

import { Event } from '@dxos/async';
import { PublicKey } from '@dxos/crypto';

import { SignalManager } from './interface';
import { SignalApi } from './signal-api';

const log = debug('dxos:network-manager:websocket-signal-manager');

export class WebsocketSignalManager implements SignalManager {
  private readonly _servers = new Map<string, SignalApi>();

  readonly statusChanged = new Event<SignalApi.Status[]>();

  readonly commandTrace = new Event<SignalApi.CommandTrace>();

  constructor (
    private readonly _hosts: string[],
    private readonly _onOffer: (message: SignalApi.SignalMessage) => Promise<SignalApi.Answer>
  ) {
    assert(_hosts.length === 1, 'Only a single signaling server connection is supported');
  }

  getStatus (): SignalApi.Status[] {
    return Array.from(this._servers.values()).map(server => server.getStatus());
  }

  async connect () {
    await Promise.all(this._hosts.map(async host => {
      const server = new SignalApi(
        host,
        async (msg) => this._onOffer(msg),
        async msg => {
          this.onSignal.emit(msg);
        }
      );
      this._servers.set(host, server);
      server.statusChanged.on(() => this.statusChanged.emit(this.getStatus()));
      server.commandTrace.on(trace => this.commandTrace.emit(trace));
      await server.connect();
    }));
  }

  join (topic: PublicKey, peerId: PublicKey) {
    log(`Join ${topic} ${peerId}`);
    for (const server of this._servers.values()) {
      server.join(topic, peerId).then(peers => {
        log(`Peer candidates changed ${topic} ${peers}`);
        // TODO(marik-d): Deduplicate peers.
        this.peerCandidatesChanged.emit([topic, peers]);
      });
    }
  }

  leave (topic: PublicKey, peerId: PublicKey) {
    log(`Leave ${topic} ${peerId}`);
    for (const server of this._servers.values()) {
      server.leave(topic, peerId);
    }
  }

  lookup (topic: PublicKey) {
    log(`Lookup ${topic}`);
    for (const server of this._servers.values()) {
      server.lookup(topic).then(peers => {
        log(`Peer candidates changed ${topic} ${peers}`);
        // TODO(marik-d): Deduplicate peers.
        this.peerCandidatesChanged.emit([topic, peers]);
      });
    }
  }

  offer (msg: SignalApi.SignalMessage) {
    log(`Offer ${msg.remoteId}`);
    // TODO(marik-d): Broadcast to all signal servers.
    return Array.from(this._servers.values())[0].offer(msg);
  }

  signal (msg: SignalApi.SignalMessage) {
    log(`Signal ${msg.remoteId}`);
    for (const server of this._servers.values()) {
      server.signal(msg);
      // TODO(marik-d): Error handling.
    }
  }

  peerCandidatesChanged = new Event<[topic: PublicKey, candidates: PublicKey[]]>()

  onSignal = new Event<SignalApi.SignalMessage>();
}
