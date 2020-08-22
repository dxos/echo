//
// Copyright 2020 DXOS.org
//

import { createId, createKeyPair } from '@dxos/crypto';
import { createMessage, createTransform, latch } from '@dxos/experimental-util';

import { dxos } from './proto/gen/testing';

import { TestModel } from './testing';
import { ModelFactory } from './model-factory';
import { ModelMessage } from './types';

describe('model factory', () => {
  test('model constructor', async () => {
    const itemId = createId();

    // Create model.
    const modelFactory = new ModelFactory().registerModel(TestModel.type, TestModel);
    const model = modelFactory.createModel<TestModel>(TestModel.type, itemId);
    expect(model).toBeTruthy();
  });

  test('model mutation processing', async () => {
    const { publicKey: feedKey } = createKeyPair();
    const itemId = createId();

    const objects: dxos.echo.testing.ITestItemMutation[] = [];

    // Transform outbound mutations to inbounds model messsges (create loop).
    const writable = createTransform<
      dxos.echo.testing.ITestItemMutation, ModelMessage<dxos.echo.testing.ITestItemMutation>
      >(
        async (message: dxos.echo.testing.ITestItemMutation) => {
          objects.push(message);
          const out: ModelMessage<dxos.echo.testing.ITestItemMutation> = {
            meta: {
              feedKey,
              seq: 1
            },
            mutation: message
          };

          return out;
        }
      );

    // Create model.
    const modelFactory = new ModelFactory().registerModel(TestModel.type, TestModel);
    const model = modelFactory.createModel<TestModel>(TestModel.type, itemId, writable);
    expect(model).toBeTruthy();

    // Update model.
    await model.setProperty('title', 'Hello');
    expect(objects).toHaveLength(1);
    expect(objects[0]).toEqual(createMessage<dxos.echo.testing.ITestItemMutation>({
      set: {
        key: 'title',
        value: 'Hello'
      }
    }, 'dxos.echo.testing.TestItemMutation'));

    // Expect model has not been updated (mutation has not been processed).
    expect(model.getProperty('title')).toBeFalsy();

    // Listen for updates.
    const [update, onUpdate] = latch(1);
    model.subscribe(onUpdate);

    // Loop model output to input.
    writable.pipe(model.processor);

    // Wait for message to be processed.
    await update;

    // Expect model to have been updated.
    expect(model.getProperty('title')).toEqual('Hello');
  });
});
