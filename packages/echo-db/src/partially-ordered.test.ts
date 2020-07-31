//
// Copyright 2020 DXOS.org
//

import { DefaultPartiallyOrderedModel } from './partially-ordered';

class ModelUnderTest extends DefaultPartiallyOrderedModel<any> {
  constructor () {
    super();
    this.on('append', (message: any) => this.processMessages([{ data: message }]));
  }
}

describe('Partially Ordered Model', () => {
  test('collects messages arriving in order', async () => {
    const model = new ModelUnderTest();
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
    const model = new ModelUnderTest();
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
    const model = new ModelUnderTest();
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
    const model = new ModelUnderTest();
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

  test('forks are resolved by picking both candidates', async () => {
    const model = new ModelUnderTest();
    await model.processMessages([
      { data: { messageId: 1, previousMessageId: 0 } },
      { data: { messageId: 2, previousMessageId: 1, value: 'a' } },
      { data: { messageId: 2, previousMessageId: 1, value: 'b' } },
      { data: { messageId: 3, previousMessageId: 2, value: 'c' } }
    ]);

    expect(model.messages.length).toEqual(4);
    expect(model.messages[0]).toStrictEqual({ data: { messageId: 1, previousMessageId: 0 } });

    expect(model.messages[1].data.value === 'a' || model.messages[2].data.value === 'a').toBeTruthy();
    expect(model.messages[1].data.value === 'b' || model.messages[2].data.value === 'b').toBeTruthy();

    expect(model.messages[3]).toStrictEqual({ data: { messageId: 3, previousMessageId: 2, value: 'c' } });
  });

  test('message can be inserted retrospectively', async () => {
    const model = new ModelUnderTest();
    await model.processMessages([
      { data: { messageId: 1, previousMessageId: 0 } },
      { data: { messageId: 2, previousMessageId: 1, value: 'a' } },
      { data: { messageId: 3, previousMessageId: 2, value: 'b' } },
      { data: { messageId: 4, previousMessageId: 3, value: 'c' } }
    ]);

    expect(model.messages).toStrictEqual([
      { data: { messageId: 1, previousMessageId: 0 } },
      { data: { messageId: 2, previousMessageId: 1, value: 'a' } },
      { data: { messageId: 3, previousMessageId: 2, value: 'b' } },
      { data: { messageId: 4, previousMessageId: 3, value: 'c' } }
    ]);

    await model.processMessages([
      { data: { messageId: 2, previousMessageId: 1, value: 'retrospective add' } }
    ]);

    expect(model.messages.length).toEqual(5);
  });

  test('message can be inserted using append message', async () => {
    const model = new ModelUnderTest();
    await model.appendMessage({ value: 'genesis' });
    await model.appendMessage({ value: 'a' });
    await model.appendMessage({ value: 'b' });
    await model.appendMessage({ value: 'c' });

    expect(model.messages).toStrictEqual([
      { data: { messageId: 1, previousMessageId: 0, value: 'genesis' } },
      { data: { messageId: 2, previousMessageId: 1, value: 'a' } },
      { data: { messageId: 3, previousMessageId: 2, value: 'b' } },
      { data: { messageId: 4, previousMessageId: 3, value: 'c' } }
    ]);
  });

  test.skip('message inserted retrospectively is sorted into the middle of the feed', async () => {
    const model = new ModelUnderTest();
    await model.processMessages([
      { data: { messageId: 1, previousMessageId: 0 } },
      { data: { messageId: 2, previousMessageId: 1, value: 'a' } },
      { data: { messageId: 3, previousMessageId: 2, value: 'b' } },
      { data: { messageId: 4, previousMessageId: 3, value: 'c' } }
    ]);

    await model.processMessages([
      { data: { messageId: 2, previousMessageId: 1, value: 'retrospective add' } }
    ]);

    expect(model.messages.length).toEqual(5);
    expect(model.messages[4].value).toEqual('c');
  });
});
