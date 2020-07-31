//
// Copyright 2020 DXOS.org
//

import { DefaultOrderedModel } from './ordered';

test('collects messages arriving in order', async () => {
  const model = new DefaultOrderedModel();
  await model.processMessages([
    { data: { messageId: 1, previousMessageId: 0 } },
    { data: { messageId: 2, previousMessageId: 1 } },
    { data: { messageId: 3, previousMessageId: 2 } },
    { data: { messageId: 4, previousMessageId: 3 } }
  ]);

  expect(model.messages).toStrictEqual([
    { data: { messageId: 1, previousMessageId: 0 } },
    { data: { messageId: 2, previousMessageId: 1 } },
    { data: { messageId: 3, previousMessageId: 2 } },
    { data: { messageId: 4, previousMessageId: 3 } }
  ]);
});

test('collects messages arriving out of order', async () => {
  const model = new DefaultOrderedModel();
  await model.processMessages([
    { data: { messageId: 1, previousMessageId: 0 } },
    { data: { messageId: 3, previousMessageId: 2 } },
    { data: { messageId: 4, previousMessageId: 3 } },
    { data: { messageId: 2, previousMessageId: 1 } }
  ]);

  expect(model.messages).toStrictEqual([
    { data: { messageId: 1, previousMessageId: 0 } },
    { data: { messageId: 2, previousMessageId: 1 } },
    { data: { messageId: 3, previousMessageId: 2 } },
    { data: { messageId: 4, previousMessageId: 3 } }
  ]);
});

test('collects messages with genesis message arriving last', async () => {
  const model = new DefaultOrderedModel();
  await model.processMessages([
    { data: { messageId: 2, previousMessageId: 1 } },
    { data: { messageId: 3, previousMessageId: 2 } },
    { data: { messageId: 4, previousMessageId: 3 } },
    { data: { messageId: 1, previousMessageId: 0 } }
  ]);

  expect(model.messages).toStrictEqual([
    { data: { messageId: 1, previousMessageId: 0 } },
    { data: { messageId: 2, previousMessageId: 1 } },
    { data: { messageId: 3, previousMessageId: 2 } },
    { data: { messageId: 4, previousMessageId: 3 } }
  ]);
});

test('collects messages arriving out of order in different bunches', async () => {
  const model = new DefaultOrderedModel();
  await model.processMessages([
    { data: { messageId: 1, previousMessageId: 0 } },
    { data: { messageId: 3, previousMessageId: 2 } }
  ]);

  expect(model.messages).toStrictEqual([
    { data: { messageId: 1, previousMessageId: 0 } }
  ]);

  await model.processMessages([
    { data: { messageId: 4, previousMessageId: 3 } },
    { data: { messageId: 2, previousMessageId: 1 } }
  ]);

  expect(model.messages).toStrictEqual([
    { data: { messageId: 1, previousMessageId: 0 } },
    { data: { messageId: 2, previousMessageId: 1 } },
    { data: { messageId: 3, previousMessageId: 2 } },
    { data: { messageId: 4, previousMessageId: 3 } }
  ]);
});

test('forks are resolved by picking the first candidate', async () => {
  const model = new DefaultOrderedModel<any>();
  await model.processMessages([
    { data: { messageId: 1, previousMessageId: 0 } },
    { data: { messageId: 2, previousMessageId: 1, value: 'a' } },
    { data: { messageId: 2, previousMessageId: 1, value: 'b' } }
  ]);

  expect(model.messages).toStrictEqual([
    { data: { messageId: 1, previousMessageId: 0 } },
    { data: { messageId: 2, previousMessageId: 1, value: 'a' } }
  ]);
});

class ModelWithValidation extends DefaultOrderedModel<any> {
  validateCandidate (_intendedPosition: number, _message: any) {
    return _intendedPosition === 0 || _message.data.value === 'b';
  }
}

test('models can add custom validation rules', async () => {
  const model = new ModelWithValidation();
  await model.processMessages([
    { data: { messageId: 1, previousMessageId: 0 } },
    { data: { messageId: 2, previousMessageId: 1, value: 'a' } },
    { data: { messageId: 2, previousMessageId: 1, value: 'b' } }
  ]);

  expect(model.messages).toStrictEqual([
    { data: { messageId: 1, previousMessageId: 0 } },
    { data: { messageId: 2, previousMessageId: 1, value: 'b' } }
  ]);
});
