//
// Copyright 2020 DXOS.org
//

import { DefaultOrderedModel } from './ordered';
import { createModelMessage } from './common';
import { dxos } from './proto';
import OrderedModelData = dxos.echo.OrderedModelData;

const createOrderedData = (message: any,
  messageId: number | null | undefined = 1,
  previousMessageId: number | null | undefined = 0) => {
  return OrderedModelData.create({
    messageId,
    previousMessageId,
    message
  });
};

const generateMessages = (count: number, data = {}) => {
  const ordered = [];
  for (let i = 0; i < count; i++) {
    ordered.push(createModelMessage(createOrderedData(data, i + 1, i)));
  }
  return ordered;
};

const shuffle = (value: any[]) => {
  return [...value].sort(() => Math.random() - 0.5);
};

test('collects messages arriving in order', async () => {
  const model = new DefaultOrderedModel();
  const messages = generateMessages(10);

  await model.processMessages(messages);
  expect(model.messages).toStrictEqual(messages);
});

test('collects messages arriving out of order', async () => {
  const model = new DefaultOrderedModel();
  const messages = generateMessages(10);

  await model.processMessages(shuffle(messages));
  expect(model.messages).toStrictEqual(messages);
});

test('collects messages with genesis message arriving last', async () => {
  const model = new DefaultOrderedModel();
  const messages = generateMessages(10);
  await model.processMessages([...messages].reverse());

  expect(model.messages).toStrictEqual(messages);
});

test('collects messages arriving out of order in different bunches', async () => {
  const model = new DefaultOrderedModel();
  const messages = generateMessages(10);

  await model.processMessages([messages[0], messages[2]]);
  expect(model.messages).toStrictEqual([messages[0]]);

  await model.processMessages([messages[4], messages[1], messages[3]]);
  expect(model.messages).toStrictEqual(messages.slice(0, 5));

  await model.processMessages(messages.slice(5));
  expect(model.messages).toStrictEqual(messages);
});

test('forks are resolved by picking the first candidate', async () => {
  const model = new DefaultOrderedModel();

  const messages = [
    DefaultOrderedModel.createGenesisMessage({}),
    createModelMessage(createOrderedData({ value: 'a' }, 2, 1)),
    createModelMessage(createOrderedData({ value: 'b' }, 2, 1))
  ];

  await model.processMessages(messages);
  expect(model.messages).toStrictEqual(messages.slice(0, 2));
});

class ModelWithValidation extends DefaultOrderedModel {
  validateCandidate (_intendedPosition: number, _message: any) {
    return _intendedPosition === 0 || _message.data.message.value === 'b';
  }
}

test('models can add custom validation rules', async () => {
  const model = new ModelWithValidation();
  const messages = [
    DefaultOrderedModel.createGenesisMessage({}),
    createModelMessage(createOrderedData({ value: 'a' }, 2, 1)),
    createModelMessage(createOrderedData({ value: 'b' }, 2, 1))
  ];

  await model.processMessages(messages);
  expect(model.messages).toStrictEqual([messages[0], messages[2]]);
});
