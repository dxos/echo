//
// Copyright 2020 DxOS
//

import debug from 'debug';

import { createId } from '@dxos/crypto';

// import { Codec } from '@dxos/codec-protobuf';

import { MutationUtil, KeyValueUtil } from './mutation';
import { ObjectModel } from './object';
import { createObjectId, fromObject } from './util';
import { mergeFeeds } from './crdt';

// import DataProtoDefs from './data.proto';

// const codec = new Codec('.testing.Message')
//   .addJson(require('./data.json'))
//   .build();

const log = debug('dxos:echo:test');

// TODO(burdon): Use protobuf defs.
test('Protobuf', () => {
  // expect(DataProto.Value.decode(DataProto.Value.encode({ isNull: true }))).toEqual({ isNull: true });
});

test('Mutations', () => {
  const objectId = createObjectId('test');

  const feed = {
    id: createId,
    messages: [
      MutationUtil.createMessage(objectId, KeyValueUtil.createMessage('title', 'Test-1')),
      MutationUtil.createMessage(objectId, KeyValueUtil.createMessage('priority', 1)),
      MutationUtil.createMessage(objectId, KeyValueUtil.createMessage('complete', false))
    ]
  };

  const model = new ObjectModel().applyMutations(feed.messages);

  expect(model.getObjectsByType('test')).toHaveLength(1);
  expect(model.getTypes()).toEqual(['test']);

  const object = model.getObjectById(objectId);
  expect(object).toEqual({
    id: objectId,
    properties: {
      title: 'Test-1',
      complete: false,
      priority: 1
    }
  });

  {
    const messages = fromObject(object);
    const model = new ObjectModel().applyMutations(messages);
    const clone = model.getObjectById(object.id);
    expect(object).toEqual(clone);
  }
});

// TODO(burdon): Test with Framework (Gravity/wireline-core)?
// TODO(burdon): Describe consistency constraints (e.g., each Object is independent; mutation references previous).
test('Merge feeds', () => {
  const obj = { x: createObjectId('test'), y: createObjectId('test') };
  const ref = {};

  const feed1 = {
    id: 'feed-1',
    messages: [
      (ref.a = MutationUtil.createMessage(obj.x, KeyValueUtil.createMessage('title', 'Test-1'))),
      (ref.b = MutationUtil.createMessage(obj.x, KeyValueUtil.createMessage('priority', 1))),
      (ref.c = MutationUtil.createMessage(obj.x, KeyValueUtil.createMessage('complete', false)))
    ]
  };

  const feed2 = {
    id: 'feed-2',
    messages: [
      (ref.d = MutationUtil.createMessage(obj.y, KeyValueUtil.createMessage('title', 'Test-2'))),
      (ref.e = MutationUtil.createMessage(obj.x, KeyValueUtil.createMessage('priority', 3), { depends: ref.b.id })),
      (ref.f = MutationUtil.createMessage(obj.y, KeyValueUtil.createMessage('complete', true)))
    ]
  };

  const feed3 = {
    id: 'feed-3',
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

    const model = new ObjectModel().applyMutations(messages);

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

test('Last writer wins', () => {
  // Verify that the causally last write performed concurrently persists (montonicity property preserved).
  // Three nodes: A, B, C.
  // Initially A sets property value to "ValueA".
  // That mutation is received by B and C.
  // B changes property value to "ValueB".
  // C changes property value to "ValueC".
  // Mutations from B and C are now received by A.
  // A now changes property value to "ValueAPrime".
  // All mutations received by all nodes.
  // Expected result: all nodes have property value == "ValueAPrime".

  const createFeed = () => {
    return [];
  };

  const createNode = (name) => {
    log(`createNode: ${name}`);
    return {
      name,
      writeFeed: createFeed(),
      readFeeds: {}
    };
  };

  // TODO(dboreham): Should be in ObjectModel.
  const getMostRecentMutation = () => {
    return 'What goes here?';
  };

  const testObjectId = createObjectId('testObjectType');
  const testProperty = 'testProperty';

  const appendMutation = (node, value) => {
    log(`appendMutation: ${node.name}, ${value}`);
    const message = MutationUtil.createMessage(
      testObjectId,
      KeyValueUtil.createMessage(testProperty, value, { depends: getMostRecentMutation() })
    );
    node.writeFeed.push(message);
  };

  const getCurrentValue = (node) => {
    log('Merging:');
    Object.keys(node.readFeeds).forEach(peer => log(`${peer}: ${JSON.stringify(node.readFeeds[peer])}`));
    const transformedFeeds = Object.keys(node.readFeeds).map(
      nodeName => { return { id: nodeName, messages: node.readFeeds[nodeName] }; }
    );
    const mergedFeeds = mergeFeeds(transformedFeeds);
    log('Merged:');
    log(`${JSON.stringify(mergedFeeds)}`);
    const model = new ObjectModel().applyMutations(mergedFeeds);
    const object = model.getObjectById(testObjectId);
    log(`getCurrentValue: ${node.name}, ${JSON.stringify(object.properties)}`);
    return object.properties.testProperty;
  };

  const replicateBetween = (peer1, peer2) => {
    // Bidirectional replication
    peer1.readFeeds[peer2.name] = peer2.writeFeed;
    peer2.readFeeds[peer1.name] = peer1.writeFeed;
    // Update the read copy of our own feed so processing readFeeds will find the latest messages
    peer1.readFeeds[peer1.name] = peer1.writeFeed;
    peer2.readFeeds[peer2.name] = peer2.writeFeed;
  };

  const nodes = {};
  for (const nodeName of ['A', 'B', 'C']) {
    nodes[nodeName] = createNode(nodeName);
  }

  appendMutation(nodes.A, 'ValueA');

  replicateBetween(nodes.A, nodes.B);
  replicateBetween(nodes.A, nodes.C);

  appendMutation(nodes.B, 'ValueB');
  appendMutation(nodes.C, 'ValueC');

  replicateBetween(nodes.A, nodes.B);
  replicateBetween(nodes.A, nodes.C);

  appendMutation(nodes.A, 'ValueAPrime');

  replicateBetween(nodes.A, nodes.B);
  replicateBetween(nodes.A, nodes.C);
  replicateBetween(nodes.B, nodes.C);

  const terminalValues = {
    A: getCurrentValue(nodes.A),
    B: getCurrentValue(nodes.B),
    C: getCurrentValue(nodes.C)
  };

  expect(terminalValues.A).toEqual(terminalValues.B);
  expect(terminalValues.A).toEqual(terminalValues.C);
  expect(terminalValues.B).toEqual(terminalValues.C);

  expect(terminalValues.C).toEqual('ValueAPrime');
});
