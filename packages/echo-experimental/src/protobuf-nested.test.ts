//
// Copyright 2020 DXOS.org
//

import debug from 'debug';

import { keyToString } from '@dxos/crypto';
import { Codec } from '@dxos/codec-protobuf';

import TestingSchema from './proto/gen/testing.json';

import { google } from "./proto/gen/testing";
import IAny = google.protobuf.IAny;

import { dxos } from "./proto/gen/testing";
import ITestEnvelope = dxos.echo.testing.ITestEnvelope;
import ITestPayload = dxos.echo.testing.ITestPayload;
import TestPayload = dxos.echo.testing.TestPayload;
import TestEnvelope = dxos.echo.testing.TestEnvelope;

const log = debug('dxos:echo:prototesting');

const codec = new Codec('dxos.echo.testing.Envelope')
  .addJson(TestingSchema)
  .build();

describe('Protocol buffers and typescript types.', () => {
  test('flatjson', () => {

    const consumePayload = (payload: ITestPayload): number => {
      // TODO(richburdon): How do we want to code this? Magic undefined cast as below, or
      // if undefined throw exception, or codec implements required field?
      return payload.testfield!;
    };

    // This only works because the return type is not checked (it isn't ITestPayload).
    const producePayload = (value: number) => {
      const payload = {
        __type_url: 'dxos.echo.testing.TestPayload',
        testfield: value
      };
      return payload;
    }

    const message1 = producePayload(123);
    log(`message1: ${JSON.stringify(message1)}`);

    const buffer = codec.encode({ message: message1 });
    log(`buffer: ${keyToString(buffer)}`);

    const message2 = codec.decode(buffer).message;
    log(`message2: ${JSON.stringify(message2)}`);

    expect(message1).toEqual(message2);

    const value = consumePayload(message2);

    expect(value).toEqual(123);
  });

  test('flatts', () => {

    const consumePayload = (payload: ITestPayload): number => {
      return payload.testfield!;
    };

    const producePayload = (value: number): ITestPayload => {
      const payload = new TestPayload();
      payload.testfield = value;
      // We need this line for the codec to work, but it throws a TS2339 error.
      // payload.__type_url = 'dxos.echo.testing.Admit';
      return payload;
    }

    const message1 = producePayload(123);
    log(`message1: ${JSON.stringify(message1)}`);

    const buffer = codec.encode({ message: message1 });
    log(`buffer: ${keyToString(buffer)}`);

    const message2 = codec.decode(buffer).message;
    log(`message2: ${JSON.stringify(message2)}`);

    expect(message1).toEqual(message2);

    const value = consumePayload(message2);

    expect(value).toEqual(123);
  });

  test('nestedts', () => {

    const consumeEnvelope = (envelope: ITestEnvelope): number => {
      const payload: ITestPayload = envelope.payload as ITestPayload;
      return payload.testfield!;
    };

    const produceEnvelope = (value: number): ITestEnvelope => {
      const payload = new TestPayload();
      payload.testfield = value;
      // Next line produces TS2339 compiler error.
      // payload.__type_url = 'dxos.echo.testing.TestPayload';
      const envelope = new TestEnvelope();
      log(`payload: ${JSON.stringify(payload)}`);
      // This doesn't work (object properties are lost in the cast):
      envelope.payload = payload as IAny;
      return envelope;
    }

    const message1 = produceEnvelope(123);
    log(`message1: ${JSON.stringify(message1)}`);

    const buffer = codec.encode({ message: message1 });
    log(`buffer: ${keyToString(buffer)}`);

    const message2 = codec.decode(buffer).message;
    log(`message2: ${JSON.stringify(message2)}`);

    expect(message1).toEqual(message2);

    const value = consumeEnvelope(message2);

    expect(value).toEqual(123);
  });
});
