//
// Copyright 2020 DXOS.org
//

import { Event } from '@dxos/async';
import { PublicKey } from '@dxos/crypto';
import { Protocol } from '@dxos/protocol';
import { ComplexMap } from '@dxos/util';

import { SignalApi } from '../signal/signal-api';
import { Connection } from './connection';
import { WebrtcConnection } from './webrtc-connection';

export class InMemoryConnection implements Connection {
  stateChanged = new Event<WebrtcConnection.State>();
  closed = new Event<void>();

  state: WebrtcConnection.State = WebrtcConnection.State.WAITING_FOR_CONNECTION;

  _remoteConnection?: InMemoryConnection;

  constructor (
    private readonly _ownId: PublicKey,
    private readonly _remoteId: PublicKey,
    private readonly _sessionId: PublicKey,
    private readonly _topic: PublicKey,
    private readonly _protocol: Protocol
  ) {
    this._remoteConnection = connections.get([_topic, _remoteId, _ownId]);
    if (this._remoteConnection) {
      const stream = _protocol.stream as any;
      stream.pipe(this._remoteConnection._protocol.stream).pipe(stream);
      this.state = WebrtcConnection.State.CONNECTED;
      this.stateChanged.emit(this.state);
      this._remoteConnection.state = WebrtcConnection.State.CONNECTED;
      this._remoteConnection.stateChanged.emit(this._remoteConnection.state);
    } else {
      connections.set([_topic, _ownId, _remoteId], this);
    }
  }

  get remoteId (): PublicKey {
    return this._remoteId;
  }

  get sessionId (): PublicKey {
    return this._sessionId;
  }

  signal (msg: SignalApi.SignalMessage): void {
    // Does nothing.
  }

  async close (): Promise<void> {
    if (this._remoteConnection) {
      const stream = this._protocol.stream as any;
      stream.unpipe(this._remoteConnection._protocol.stream).unpipe(stream);
      this.state = WebrtcConnection.State.CLOSED;
      this.stateChanged.emit(this.state);
      this._remoteConnection.state = WebrtcConnection.State.CLOSED;
      this._remoteConnection.stateChanged.emit(this._remoteConnection.state);
      this._remoteConnection.close();
      this._remoteConnection = undefined;
    }
  }
}

const connections = new ComplexMap<[topic: PublicKey, nodeId: PublicKey, remoteId: PublicKey], InMemoryConnection>(([topic, nodeId, remoteId]) => topic.toHex() + nodeId.toHex() + remoteId.toHex());
