//
// Copyright 2020 DXOS.org
//

import { DefaultPartiallyOrderedModel } from './partially-ordered';
import { dxos } from './proto';
import { Any, createModelMessage } from './common';
import IModelMessage = dxos.echo.IModelMessage;
import OrderedModelData = dxos.echo.OrderedModelData;

class ModelUnderTest extends DefaultPartiallyOrderedModel {
  constructor () {
    super();
    this.on('append', async (message: IModelMessage) => this.processMessages([message]));
  }
}

const generateMessages = (count: number) => {
  const ordered = [];
  for (let i = 0; i < count; i++) {
    ordered.push(createModelMessage(createOrderedModelData(i, i + 1, i)));
  }
  return ordered;
};

const createTestItemValue = (value: any) => {
  return Any.create({
    __type_url: 'test.TestItem',
    value
  });
};

const createOrderedModelData = (value: any,
  messageId: number | null | undefined = 1,
  previousMessageId: number | null | undefined = 0) => {
  return OrderedModelData.create({
    messageId,
    previousMessageId,
    data: createTestItemValue(value)
  });
};

const shuffle = (value: any[]) => {
  return [...value].sort(() => Math.random() - 0.5);
};

describe('Partially Ordered Model', () => {
  test('collects messages arriving in order', async () => {
    const model = new ModelUnderTest();
    const messages = generateMessages(10);

    await model.processMessages(messages);
    expect(model.messages).toStrictEqual(messages);
  });

  test('collects messages arriving out of order', async () => {
    const model = new ModelUnderTest();
    const messages = generateMessages(10);

    await model.processMessages(shuffle(messages));
    expect(model.messages).toStrictEqual(messages);
  });

  test('collects messages with genesis message arriving last', async () => {
    const model = new ModelUnderTest();
    const messages = generateMessages(10);
    await model.processMessages([...messages].reverse());

    expect(model.messages).toStrictEqual(messages);
  });

  test('collects messages arriving out of order in different bunches', async () => {
    const model = new ModelUnderTest();
    const messages = generateMessages(10);

    await model.processMessages([messages[0], messages[2]]);
    expect(model.messages).toStrictEqual([messages[0]]);

    await model.processMessages([messages[4], messages[1], messages[3]]);
    expect(model.messages).toStrictEqual(messages.slice(0, 5));

    await model.processMessages(messages.slice(5));
    expect(model.messages).toStrictEqual(messages);
  });

  test('forks are resolved by picking both candidates', async () => {
    const model = new ModelUnderTest();
    const messages = [
      ModelUnderTest.createGenesisMessage(createTestItemValue('genesis')),
      createModelMessage(createOrderedModelData('a', 2, 1)),
      createModelMessage(createOrderedModelData('b', 2, 1)),
      createModelMessage(createOrderedModelData('c', 3, 2))
    ];

    await model.processMessages(messages);

    expect(model.messages.length).toEqual(4);
    expect(model.messages[0]).toStrictEqual(messages[0]);

    // We are not guaranteed if 'a' or 'b' will be first, but they should both be grouped together.
    expect(model.messages.slice(1, 3)).toContainEqual(messages[1]);
    expect(model.messages.slice(1, 3)).toContainEqual(messages[2]);

    expect(model.messages[3]).toStrictEqual(messages[3]);
  });

  test('message can be inserted retrospectively', async () => {
    const model = new ModelUnderTest();
    const messages = [
      ModelUnderTest.createGenesisMessage(createTestItemValue('genesis')),
      createModelMessage(createOrderedModelData('a', 2, 1)),
      createModelMessage(createOrderedModelData('b', 3, 2)),
      createModelMessage(createOrderedModelData('c', 4, 3))
    ];

    await model.processMessages(messages);
    expect(model.messages).toStrictEqual(messages);

    const retro = createModelMessage(createOrderedModelData('retro', 2, 1));
    await model.processMessages([retro]);

    expect(model.messages.length).toEqual(5);
  });

  test('message can be inserted using append message', async () => {
    const model = new ModelUnderTest();
    await model.appendMessage(createTestItemValue('genesis'));
    await model.appendMessage(createTestItemValue('a'));
    await model.appendMessage(createTestItemValue('b'));
    await model.appendMessage(createTestItemValue('c'));

    expect(model.messages.map(message => message.data)).toStrictEqual([
      ModelUnderTest.createGenesisMessage(createTestItemValue('genesis')),
      createModelMessage(createOrderedModelData('a', 2, 1)),
      createModelMessage(createOrderedModelData('b', 3, 2)),
      createModelMessage(createOrderedModelData('c', 4, 3))
    ].map(message => message.data));
  });

  test.skip('message inserted retrospectively is sorted into the middle of the feed', async () => {
    const model = new ModelUnderTest();
    const messages = [
      ModelUnderTest.createGenesisMessage(createTestItemValue('genesis')),
      createModelMessage(createOrderedModelData('a', 2, 1)),
      createModelMessage(createOrderedModelData('b', 3, 2)),
      createModelMessage(createOrderedModelData('c', 4, 3))
    ];
    await model.processMessages(messages);

    const retro = createModelMessage(createOrderedModelData('retro', 2, 1));
    await model.processMessages([retro]);

    expect(model.messages.length).toEqual(5);
    expect(model.messages[4]).toEqual(messages[4]);
  });
});
