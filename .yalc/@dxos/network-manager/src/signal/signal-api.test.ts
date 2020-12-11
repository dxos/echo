//
// Copyright 2020 DXOS.org
//

import { expect, mockFn } from 'earljs';
import waitForExpect from 'wait-for-expect';

import { PublicKey } from '@dxos/crypto';

import { SignalApi } from './signal-api';

describe('SignalApi', () => {
  let topic: PublicKey;
  let peer1: PublicKey;
  let peer2: PublicKey;
  let api: SignalApi;

  beforeEach(() => {
    topic = PublicKey.random();
    peer1 = PublicKey.random();
    peer2 = PublicKey.random();
  });

  afterEach(async () => {
    await api.close();
  });

  it('join', async () => {
    api = new SignalApi('wss://apollo1.kube.moon.dxos.network/dxos/signal', (async () => {}) as any, async () => {});

    api.connect();

    const join = await api.join(topic, peer1);
    expect(join).toEqual([peer1]);

    const join2 = await api.join(topic, peer2);
    expect(join2).toEqual([peer1, peer2]);
  }).timeout(10_000);

  it('offer', async () => {
    const offerMock = mockFn<(msg: SignalApi.SignalMessage) => Promise<SignalApi.Answer>>()
      .resolvesTo({ accept: true });
    api = new SignalApi('wss://apollo1.kube.moon.dxos.network/dxos/signal', offerMock, async () => {});

    api.connect();

    await api.join(topic, peer1);

    const offer: SignalApi.SignalMessage = {
      data: { foo: 'bar' } as any,
      id: peer2,
      remoteId: peer1,
      sessionId: PublicKey.random(),
      topic
    };
    const offerResult = await api.offer(offer);
    expect(offerResult).toEqual({ accept: true });
    expect(offerMock).toHaveBeenCalledWith([offer]);
  }).timeout(5_000);

  it('signal', async () => {
    const signalMock = mockFn<(msg: SignalApi.SignalMessage) => Promise<void>>()
      .resolvesTo();
    api = new SignalApi('wss://apollo1.kube.moon.dxos.network/dxos/signal', (async () => {}) as any, signalMock);

    api.connect();

    await api.join(topic, peer1);

    const msg: SignalApi.SignalMessage = {
      id: peer2,
      remoteId: peer1,
      sessionId: PublicKey.random(),
      topic,
      data: { foo: 'bar' } as any
    };
    await api.signal(msg);

    await waitForExpect(() => {
      expect(signalMock).toHaveBeenCalledWith([msg]);
    }, 4_000);
  }).timeout(5_000);
});
