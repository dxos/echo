//
// Copyright 2020 DxOS.org
//

import debug from 'debug';

import { randomBytes } from '@dxos/crypto';

import { LogicalClockStamp, Order, logOrder } from './consistency';

const log = debug('dxos:echo:test');

test('LogicalClockStamp:zero', () => {
  const lcsZero = new LogicalClockStamp();
  const lcsNonZero = new LogicalClockStamp();
  const nonZeroVector:Map<Buffer, number> = new Map();
  nonZeroVector.set(randomBytes(), 99999);
  lcsNonZero._setVector(nonZeroVector);
  const order = LogicalClockStamp.compare(lcsZero, lcsNonZero);
  log(`compare(zero, nonZero) -> ${logOrder(order)}`);
  expect(order).toBe(Order.AFTER);
  const reverse = LogicalClockStamp.compare(lcsNonZero, lcsZero);
  log(`compare(nonZero, zero) -> ${logOrder(reverse)}`);
  expect(reverse).toBe(Order.BEFORE);
});

test('LogicalClockStamp:ordered_one_node', () => {
  const nodeId = randomBytes();

  const lcsA = new LogicalClockStamp();
  const vectorA:Map<Buffer, number> = new Map();
  vectorA.set(nodeId, 1);
  lcsA._setVector(vectorA);

  const lcsB = new LogicalClockStamp();
  const vectorB:Map<Buffer, number> = new Map();
  vectorB.set(nodeId, 2);
  lcsB._setVector(vectorB);

  const order = LogicalClockStamp.compare(lcsA, lcsB);
  log(`compare(zero, nonZero) -> ${logOrder(order)}`);
  expect(order).toBe(Order.AFTER);
  const reverse = LogicalClockStamp.compare(lcsB, lcsA);
  log(`compare(nonZero, zero) -> ${logOrder(reverse)}`);
  expect(reverse).toBe(Order.BEFORE);
});

test('LogicalClockStamp:equal_one_nodes', () => {
  const nodeId = randomBytes();

  const lcsA = new LogicalClockStamp();
  const vectorA:Map<Buffer, number> = new Map();
  vectorA.set(nodeId, 1);
  lcsA._setVector(vectorA);

  const lcsB = new LogicalClockStamp();
  const vectorB:Map<Buffer, number> = new Map();
  vectorB.set(nodeId, 1);
  lcsB._setVector(vectorB);

  const order = LogicalClockStamp.compare(lcsA, lcsB);
  log(`compare(zero, nonZero) -> ${logOrder(order)}`);
  expect(order).toBe(Order.EQUAL);
  const reverse = LogicalClockStamp.compare(lcsB, lcsA);
  log(`compare(nonZero, zero) -> ${logOrder(reverse)}`);
  expect(reverse).toBe(Order.EQUAL);
});

test('LogicalClockStamp:ordered_two_nodes', () => {
  const nodeId1 = randomBytes();
  const nodeId2 = randomBytes();

  const lcsA = new LogicalClockStamp();
  const vectorA:Map<Buffer, number> = new Map();
  vectorA.set(nodeId1, 1);
  vectorA.set(nodeId2, 2);
  lcsA._setVector(vectorA);

  const lcsB = new LogicalClockStamp();
  const vectorB:Map<Buffer, number> = new Map();
  vectorB.set(nodeId1, 2);
  vectorB.set(nodeId2, 2);
  lcsB._setVector(vectorB);

  const order = LogicalClockStamp.compare(lcsA, lcsB);
  log(`compare(zero, nonZero) -> ${logOrder(order)}`);
  expect(order).toBe(Order.AFTER);
  const reverse = LogicalClockStamp.compare(lcsB, lcsA);
  log(`compare(nonZero, zero) -> ${logOrder(reverse)}`);
  expect(reverse).toBe(Order.BEFORE);
});

test('LogicalClockStamp:unordered_two_nodes', () => {
  const nodeId1 = randomBytes();
  const nodeId2 = randomBytes();

  const lcsA = new LogicalClockStamp();
  const vectorA:Map<Buffer, number> = new Map();
  vectorA.set(nodeId1, 1);
  vectorA.set(nodeId2, 2);
  lcsA._setVector(vectorA);

  const lcsB = new LogicalClockStamp();
  const vectorB:Map<Buffer, number> = new Map();
  vectorB.set(nodeId1, 2);
  vectorB.set(nodeId2, 1);
  lcsB._setVector(vectorB);

  const order = LogicalClockStamp.compare(lcsA, lcsB);
  log(`compare(zero, nonZero) -> ${logOrder(order)}`);
  expect(order).toBe(Order.CONCURRENT);
  const reverse = LogicalClockStamp.compare(lcsB, lcsA);
  log(`compare(nonZero, zero) -> ${logOrder(reverse)}`);
  expect(reverse).toBe(Order.CONCURRENT);
});

test('LogicalClockStamp:unrelated_two_nodes', () => {
  const nodeId1 = randomBytes();
  const nodeId2 = randomBytes();

  const lcsA = new LogicalClockStamp();
  const vectorA:Map<Buffer, number> = new Map();
  vectorA.set(nodeId1, 1);
  lcsA._setVector(vectorA);

  const lcsB = new LogicalClockStamp();
  const vectorB:Map<Buffer, number> = new Map();
  vectorB.set(nodeId2, 1);
  lcsB._setVector(vectorB);

  const order = LogicalClockStamp.compare(lcsA, lcsB);
  log(`compare(zero, nonZero) -> ${logOrder(order)}`);
  expect(order).toBe(Order.CONCURRENT);
  const reverse = LogicalClockStamp.compare(lcsB, lcsA);
  log(`compare(nonZero, zero) -> ${logOrder(reverse)}`);
  expect(reverse).toBe(Order.CONCURRENT);
});

test('LogicalClockStamp:equal_two_nodes', () => {
  const nodeId1 = randomBytes();
  const nodeId2 = randomBytes();

  const lcsA = new LogicalClockStamp();
  const vectorA:Map<Buffer, number> = new Map();
  vectorA.set(nodeId1, 1);
  vectorA.set(nodeId2, 2);
  lcsA._setVector(vectorA);

  const lcsB = new LogicalClockStamp();
  const vectorB:Map<Buffer, number> = new Map();
  vectorB.set(nodeId1, 1);
  vectorB.set(nodeId2, 2);
  lcsB._setVector(vectorB);

  const order = LogicalClockStamp.compare(lcsA, lcsB);
  log(`compare(zero, nonZero) -> ${logOrder(order)}`);
  expect(order).toBe(Order.EQUAL);
  const reverse = LogicalClockStamp.compare(lcsB, lcsA);
  log(`compare(nonZero, zero) -> ${logOrder(reverse)}`);
  expect(reverse).toBe(Order.EQUAL);
});
