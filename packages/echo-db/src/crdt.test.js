//
// Copyright 2020 DxOS.org
//

import { MutationUtil, KeyValueUtil } from './mutation';
import { ObjectStore, fromObject } from './object-store';
import { createObjectId } from './util';
import { mergeFeeds } from './crdt';

test.skip('Merge feeds', () => {
  const obj = { x: createObjectId('test'), y: createObjectId('test') };
  const ref = {};

  // TODO(burdon): unqiue ID for each message?

  const feedz = [
    fromObject({ id: obj.x, properties: { title: 'Text-1' } })
  ];

  const feed1 = {
    messages: [
      (ref.a = MutationUtil.createMessage(obj.x, KeyValueUtil.createMessage('title', 'Test-1'))),
      (ref.b = MutationUtil.createMessage(obj.x, KeyValueUtil.createMessage('priority', 1))),
      (ref.c = MutationUtil.createMessage(obj.x, KeyValueUtil.createMessage('complete', false)))
    ]
  };

  const feed2 = {
    messages: [
      (ref.d = MutationUtil.createMessage(obj.y, KeyValueUtil.createMessage('title', 'Test-2'))),
      (ref.e = MutationUtil.createMessage(obj.x, KeyValueUtil.createMessage('priority', 3), { depends: ref.b.id })),
      (ref.f = MutationUtil.createMessage(obj.y, KeyValueUtil.createMessage('complete', true)))
    ]
  };

  const feed3 = {
    messages: [
      (ref.g = MutationUtil.createMessage(obj.y, KeyValueUtil.createMessage('complete', false), { depends: ref.f.id })),
      (ref.h = MutationUtil.createMessage(obj.x, KeyValueUtil.createMessage('priority', 2), { depends: ref.b.id }))
    ]
  };

  // Dependencies.
  expect(ref.b.id).toEqual(ref.e.depends);
  expect(ref.b.id).toEqual(ref.h.depends);
  expect(ref.f.id).toEqual(ref.g.depends);

  const test = (messages) => {
    expect(messages).toHaveLength(feed1.messages.length + feed2.messages.length + feed3.messages.length);

    const model = new ObjectStore().applyMutations(messages);

    {
      const object = model.getObjectById(obj.x);
      expect(object).toEqual({
        id: object.id,
        properties: {
          title: 'Test-1',
          // value overwrites previous due to dependency.
          complete: false,
          // log-3 is processed after log-2 due to sorted log IDs.
          priority: 2
        }
      });
    }

    {
      const object = model.getObjectById(obj.y);
      expect(object).toEqual({
        id: object.id,
        properties: {
          title: 'Test-2',
          complete: false
        }
      });
    }
  };

  // Test in any order.
  test(mergeFeeds([feed1, feed2, feed3]));
  test(mergeFeeds([feed3, feed2, feed1]));
  test(mergeFeeds([feed2, feed3, feed1]));
});
