//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import WebSocket from 'isomorphic-ws';
import nanomessagerpc from 'nanomessage-rpc';
import { SignalData } from 'simple-peer';
import { promisify } from 'util';

import { Event, sleep, Trigger } from '@dxos/async';
import { PublicKey } from '@dxos/crypto';

const TIMEOUT = 3_000;

const log = debug('dxos:network-manager:signal-api');

/**
 * Establishes a websocket connection to signal server and provides RPC methods.
 */
export class SignalApi {
  private _state = SignalApi.State.NOT_CONNECTED;

  private _socket?: WebSocket;

  private _lastError?: Error;

  private readonly _rpc: any;

  private readonly _connectTrigger = new Trigger();

  readonly statusChanged = new Event<SignalApi.Status>();

  readonly commandTrace = new Event<SignalApi.CommandTrace>();

  private _messageId = Date.now();

  /**
   * @param _host Signal server websocket URL.
   * @param _onOffer See `SignalApi.offer`.
   * @param _onSignal See `SignalApi.signal`.
   */
  constructor (
    private readonly _host: string,
    private readonly _onOffer: (message: SignalApi.SignalMessage) => Promise<SignalApi.Answer>,
    private readonly _onSignal: (message: SignalApi.SignalMessage) => Promise<void>
  ) {
    this._rpc = nanomessagerpc({
      send: async (data: Uint8Array) => {
        await this._connectTrigger.wait();
        assert(this._socket, 'No socket');
        await promisify(this._socket.send.bind(this._socket) as any)(data);
      },
      subscribe: (next: (data: any) => void) => {
        this._connectTrigger.wait().then(() => {
          assert(this._socket, 'No socket');
          this._socket.onmessage = async e => {
            try {
              // e.data is Buffer in node, and Blob in chrome
              let data: Buffer;
              if (Object.getPrototypeOf(e.data).constructor.name === 'Blob') {
                data = Buffer.from(await (e.data as any).arrayBuffer());
              } else {
                data = e.data as any;
              }
              next(data);
            } catch (err) {
              console.error('Unhandled error in signal server RPC:');
              console.error(err);
            }
          };
        });

        return () => {
          if (this._socket) {
            this._socket.onmessage = () => {};
          }
        };
      }
    });
    this._rpc.on('error', console.log);
    this._rpc.actions({
      offer: (message: any) => this._onOffer({
        id: PublicKey.from(message.id),
        remoteId: PublicKey.from(message.remoteId),
        topic: PublicKey.from(message.topic),
        sessionId: PublicKey.from(message.sessionId),
        data: message.data
      })
    });
    this._rpc.on('signal', (msg: SignalApi.SignalMessage) => this._onSignal({
      id: PublicKey.from(msg.id),
      remoteId: PublicKey.from(msg.remoteId),
      topic: PublicKey.from(msg.topic),
      sessionId: PublicKey.from(msg.sessionId),
      data: msg.data
    }));
    this.statusChanged.emit(this.getStatus());
  }

  connect () {
    if (this._state !== SignalApi.State.NOT_CONNECTED) {
      throw new Error('Invalid state');
    }
    this._state = SignalApi.State.CONNECTING;

    this._socket = new WebSocket(this._host);
    this._socket.onopen = () => {
      log(`Connected ${this._host}`);
      this._state = SignalApi.State.CONNECTED;
      this.statusChanged.emit(this.getStatus());
      this._connectTrigger.wake();
    };
    this._socket.onclose = () => {
      log(`Disconnected ${this._host}`);
      this._state = SignalApi.State.DISCONNECTED;
      this.statusChanged.emit(this.getStatus());
      // TODO(marik-d): Reconnect.
    };
    this._socket.onerror = e => {
      log(`Signal socket error ${this._host} ${e.message}`);
      this._state = SignalApi.State.ERROR;
      this._lastError = e.error;
      this.statusChanged.emit(this.getStatus());
      console.error('Signal socket error');
      console.error(e.error);
      // TODO(marik-d): Reconnect.
    };
  }

  async close () {
    await this._rpc.close();
    this._socket?.close();
  }

  getStatus (): SignalApi.Status {
    return {
      host: this._host,
      state: this._state,
      error: this._lastError
    };
  }

  private async _rpcCall (method: string, payload: any): Promise<any> {
    await this._rpc.open();
    const start = Date.now();
    try {
      const response = await Promise.race([
        this._rpc.call(method, payload),
        sleep(TIMEOUT).then(() => Promise.reject(new Error(`Signal RPC call timed out in ${TIMEOUT} ms`)))
      ]);
      this.commandTrace.emit({
        messageId: `${this._host}-${this._messageId++}`,
        host: this._host,
        time: Date.now() - start,
        method,
        payload,
        response
      });
      log(`Signal RPC ${this._host}: ${method} ${JSON.stringify(payload)} ${JSON.stringify(response)}`);
      return response;
    } catch (err) {
      log(`Signal RPC error ${this._host}: ${method} ${JSON.stringify(payload)} ${err.message}`);
      this.commandTrace.emit({
        messageId: `${this._host}-${this._messageId++}`,
        host: this._host,
        time: Date.now() - start,
        method,
        payload,
        error: err.message
      });
      throw err;
    }
  }

  async join (topic: PublicKey, peerId: PublicKey): Promise<PublicKey[]> {
    const peers: Buffer[] = await this._rpcCall('join', {
      id: peerId.asBuffer(),
      topic: topic.asBuffer()
    });
    return peers.map(id => PublicKey.from(id));
  }

  async leave (topic: PublicKey, peerId: PublicKey): Promise<void> {
    await this._rpcCall('leave', {
      id: peerId.asBuffer(),
      topic: topic.asBuffer()
    });
  }

  async lookup (topic: PublicKey): Promise<PublicKey[]> {
    const peers: Buffer[] = await this._rpcCall('lookup', {
      topic: topic.asBuffer()
    });
    return peers.map(id => PublicKey.from(id));
  }

  /**
   * Routes an offer to the other peer's _onOffer callback.
   * @returns Other peer's _onOffer callback return value.
   */
  async offer (payload: SignalApi.SignalMessage): Promise<SignalApi.Answer> {
    return this._rpcCall('offer', {
      id: payload.id.asBuffer(),
      remoteId: payload.remoteId.asBuffer(),
      topic: payload.topic.asBuffer(),
      sessionId: payload.sessionId.asBuffer(),
      data: payload.data
    });
  }

  /**
   * Routes an offer to the other peer's _onSignal callback.
   */
  async signal (payload: SignalApi.SignalMessage): Promise<void> {
    await this._rpc.open();
    const serializedPayload = {
      id: payload.id.asBuffer(),
      remoteId: payload.remoteId.asBuffer(),
      topic: payload.topic.asBuffer(),
      sessionId: payload.sessionId.asBuffer(),
      data: payload.data
    };
    this.commandTrace.emit({
      messageId: `${this._host}-${this._messageId++}`,
      host: this._host,
      time: 0,
      method: 'signal',
      payload: serializedPayload
    });
    return this._rpc.emit('signal', serializedPayload);
  }
}

export namespace SignalApi {
  export enum State {
    NOT_CONNECTED = 'NOT_CONNECTED',
    CONNECTING = 'CONNECTING',
    CONNECTED = 'CONNECTED',
    ERROR = 'ERROR',
    DISCONNECTED = 'DISCONNECTED',
  }

  export interface Status {
    host: string,
    state: State,
    error?: Error
  }

  export interface CommandTrace {
    messageId: string
    host: string
    time: number
    method: string
    payload: any
    response?: any
    error?: string
  }

  // TODO(marik-d): Define more concrete types for offer/answer.
  export interface SignalMessage {
    id: PublicKey
    remoteId: PublicKey,
    topic: PublicKey,
    sessionId: PublicKey,
    data: SignalData,
  }

  export interface Answer {
    accept: boolean
  }
}
