//
// Copyright 2020 DxOS
//

import debug from 'debug';
import { Graph } from 'js-data-structs';

import { MutationUtil, KeyValueUtil } from './mutation';
import { ObjectStore } from './object-store';
import { createObjectId } from './util';
import { mergeFeeds } from './dependency';

const log = debug('dxos:echo:test');

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
    return {
      name,
      writeFeed: createFeed(),
      readFeeds: {}
    };
  };

  /**
   * Sort mutations into causal partial order, returned as a total ordered array of mutation ids.
   * @param {NodeId:[{}Mutation}]} feeds
   * @param {property} graphEdgeKey
   * @return [{MutationId}]
   */
  // TODO(dboreham): The sort fn we use doesn't provide total order
  // TODO(dbboreham): First messages should depend on object genesis message: currently returns undefined ancestor
  const topoSortFeeds = (feeds, graphEdgeKey) => {
    // Sort the messages in feeds into causal partial order according to the
    // property graphEdgeKey.
    const graph = Graph(true);
    Object.keys(feeds).forEach((peer) => {
      const feed = feeds[peer];
      feed.forEach((message) => { graph.addEdge(message.id, message[graphEdgeKey]); });
    });
    return graph.topologicalSort();
  };

  // TODO(dboreham): Should be in crdt.js.
  const getMostRecentMutationId = (node) => {
    // Find leaf nodes in the dependency graph for readFeeds
    // Temporarily, pick one of them to return (depends should be an array because dependency is a lattice not a DAG).
    // Even more temporarily pick the last mutation this node wrote.
    const sortedMutationIds = topoSortFeeds(node.readFeeds, 'depends');
    log(`getMostRecentMutationId: ${sortedMutationIds}`);
    return sortedMutationIds[0];
  };

  const testObjectId = createObjectId('testObjectType');
  const testProperty = 'testProperty';

  const appendMutation = (node, value) => {
    const dependsValue = getMostRecentMutationId(node);
    const messageProperties = dependsValue ? { depends: dependsValue } : {};
    const message = MutationUtil.createMessage(
      testObjectId,
      KeyValueUtil.createMessage(testProperty, value), messageProperties
    );
    log(`appendMutation: ${message.id}: ${node.name} = ${value} -> ${dependsValue}`);
    node.writeFeed.push(message);
  };

  const getCurrentValue = (node) => {
    log('Merging:');
    Object.keys(node.readFeeds).forEach(peer => log(`${peer}: ${JSON.stringify(node.readFeeds[peer])}`));
    const mappedFeeds = Object.keys(node.readFeeds).map(
      nodeName => { return { id: nodeName, messages: node.readFeeds[nodeName] }; }
    );
    const mergedFeeds = mergeFeeds(mappedFeeds);
    log('Merged:');
    log(`${JSON.stringify(mergedFeeds)}`);
    const model = new ObjectStore().applyMutations(mergedFeeds);
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
  // Uncommenting the following line exposes the bug in our algorithm: ValueBPrime becomes the terminal value.
  // appendMutation(nodes.B, 'ValueBPrime');
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
