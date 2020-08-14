//
// Copyright 2020 DxOS.org
//

import assert from 'assert';
import debug from 'debug';

import { dxos } from '../proto/gen/testing';

import { FeedKey } from '../feeds';
import { BigIntToBuffer, BufferToBigInt } from './bigint';

const log = debug('dxos:echo:clock');

// TODO(dboreham): Separate abstract behavior from vector implementation.

export enum Order {
  CONCURRENT,
  EQUAL,
  BEFORE,
  AFTER
}

// TODO(dboreham): Rationalize with FeedId (key?)
type NodeId = Buffer;

const getLowestNodeId = (nodeIds: bigint[]): bigint => {
  return nodeIds.reduce((min, current) => current < min ? current : min, nodeIds[0]);
};

// TODO(burdon): Rename.
// TODO(burdon): Refactor (group statics).
export class LogicalClockStamp {
  private _vector: Map<bigint, number>;

  // TODO(burdon): Static helpers to standardize type.
  constructor (
    data: Map<bigint, number> | [NodeId | bigint, number][] = []
  ) {
    if (data instanceof Map) {
      this._vector = data;
    } else {
      this._vector = new Map(
        data.map(([nodeId, seq]) => [typeof nodeId !== 'bigint' ? BufferToBigInt(nodeId) : nodeId, seq]));
    }
  }

  // TODO(burdon): Constant.
  static zero (): LogicalClockStamp {
    // Empty map from constructor means zero.
    return new LogicalClockStamp();
  }

  static compare (a: LogicalClockStamp, b: LogicalClockStamp): Order {
    log(`Compare a: ${a.log()}`);
    log(`Compare b: ${b.log()}`);

    const nodeIds: Set<bigint> = new Set();

    // TODO(dboreham): set.addAllFrom(Iteraable)? or set.union(a,b)?
    for (const key of a._vector.keys()) {
      nodeIds.add(key);
    }
    for (const key of b._vector.keys()) {
      nodeIds.add(key);
    }

    let allGreaterThanOrEqual = true;
    let allLessThanOrEqual = true;
    let allEqual = true;
    for (const nodeId of nodeIds) {
      const aSeq = a._getSeqForNode(nodeId);
      const bSeq = b._getSeqForNode(nodeId);
      // TODO(dboreham): Remove logging when debugged.
      log(`aSeq:${aSeq} bSeq:${bSeq}`);
      if (aSeq !== bSeq) {
        allEqual = false;
      }
      if (aSeq < bSeq) {
        allGreaterThanOrEqual = false;
      }
      if (aSeq > bSeq) {
        allLessThanOrEqual = false;
      }
    }

    // if order is significant.
    if (allEqual) {
      return Order.EQUAL;
    } else if (allGreaterThanOrEqual) {
      return Order.AFTER;
    } else if (allLessThanOrEqual) {
      return Order.BEFORE;
    } else {
      return Order.CONCURRENT;
    }
  }

  static totalCompare (a: LogicalClockStamp, b: LogicalClockStamp):Order {
    const partialOrder = LogicalClockStamp.compare(a, b);
    if (partialOrder === Order.CONCURRENT) {
      const aLowestNodeId = getLowestNodeId(Array.from(a._vector.keys()));
      const bLowestNodeId = getLowestNodeId(Array.from(b._vector.keys()));

      log(`aLowest: ${BigIntToBuffer(aLowestNodeId).toString('hex')}, bLowest: ${BigIntToBuffer(bLowestNodeId).toString('hex')}`);
      if (aLowestNodeId === bLowestNodeId) {
        // If the two share the same lowest node id use the seq for that node id to break tie.
        const aSeq = a._vector.get(aLowestNodeId);
        assert(aSeq);
        const bSeq = b._vector.get(bLowestNodeId);
        assert(bSeq);
        log(`tie: aSeq: ${aSeq}, bSeq:${bSeq} `);
        return aSeq < bSeq ? Order.AFTER : Order.BEFORE;
      } else {
        // Otherwise pick the stamp with the lowest node id.
        return aLowestNodeId < bLowestNodeId ? Order.AFTER : Order.BEFORE;
      }
    } else {
      return partialOrder;
    }
  }

  private _entries () {
    return Array.from(this._vector.entries());
  }

  log (): string {
    // TODO(dboreham): Use DXOS lib for Buffer as Key.
    return this._entries().map(([key, value]) => `${BigIntToBuffer(key).toString('hex')}:${value}`).join(', ');
  }

  // TODO(burdon): Why to/from object AND encode/decode (make all static or external functions).
  // TODO(dboreham): Encoding scheme is a hack: use typed protocol buffer schema definition.
  toObject (): Record<string, number> {
    return objectFromEntries(this._entries().map(([key, value]) => [BigIntToBuffer(key).toString('hex'), value]));
  }

  static fromObject (source: Record<string, number>): LogicalClockStamp {
    return new LogicalClockStamp(Object.entries(source).map(([key, seq]) => [Buffer.from(key), seq]));
  }

  static encode (value: LogicalClockStamp): dxos.echo.testing.IVectorTimestamp {
    return {
      timestamp: value._entries().map(([feed, count]) => ({
        feedKey: BigIntToBuffer(feed),
        seq: count
      }))
    };
  }

  static decode (enc: dxos.echo.testing.IVectorTimestamp) {
    assert(enc.timestamp);
    return new LogicalClockStamp(enc.timestamp.map(feed => {
      assert(feed.feedKey);
      assert(feed.seq);
      return [Buffer.from(feed.feedKey), feed.seq];
    }));
  }

  private _getSeqForNode (nodeId: bigint): number {
    const seq = this._vector.get(nodeId);
    return (seq === undefined) ? 0 : seq;
  }

  static max (a: LogicalClockStamp, b: LogicalClockStamp) {
    const res = new Map<bigint, number>(a._vector);
    for (const [key, count] of b._vector) {
      res.set(key, Math.max(res.get(key) ?? 0, count));
    }
    return new LogicalClockStamp(res);
  }

  withoutFeed (feedKey: FeedKey) {
    const feedKeyInt = BufferToBigInt(feedKey as Buffer);
    return new LogicalClockStamp(this._entries().filter(([key]) => key !== feedKeyInt));
  }

  withFeed (feedKey: FeedKey, seq: number) {
    const feedKeyInt = BufferToBigInt(feedKey as Buffer);
    const mapClone = new Map(this._vector);
    mapClone.set(feedKeyInt, Math.max(mapClone.get(feedKeyInt) ?? 0, seq));
    return new LogicalClockStamp(mapClone);
  }
}

function objectFromEntries<K extends keyof any, V> (entries: [K, V][]): Record<K, V> {
  const res = {} as any;
  for (const [key, val] of entries) {
    res[key] = val;
  }
  return res;
}
