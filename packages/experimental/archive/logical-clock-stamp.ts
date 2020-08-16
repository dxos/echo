//
// Copyright 2020 DxOS.org
//

import assert from 'assert';
import debug from 'debug';

import { dxos } from '../src/proto/gen/testing';

import { FeedKey } from '../src/feeds';
import { BigIntToBuffer, BufferToBigInt } from './bigint';

const log = debug('dxos:echo:clock');

// TODO(dboreham): Separate abstract behavior from vector implementation.

// TODO(dboreham): Rationalize with FeedKey.

type NodeId = Buffer;

export enum Order {
  CONCURRENT,
  EQUAL,
  BEFORE,
  AFTER
}

// TODO(burdon): Move to util.
function objectFromEntries<K extends keyof any, V> (entries: [K, V][]): Record<K, V> {
  const res = {} as any;
  for (const [key, val] of entries) {
    res[key] = val;
  }

  return res;
}

// TODO(burdon): Move to util.
const minValue = (values: bigint[]): bigint => {
  return values.reduce((min, current) => current < min ? current : min, values[0]);
};

/**
 *
 */
export class LogicalClockStamp {
  // TODO(burdon): Constant.
  static zero (): LogicalClockStamp {
    // Empty map from constructor means zero.
    return new LogicalClockStamp();
  }

  static compare (a: LogicalClockStamp, b: LogicalClockStamp): Order {
    log(`Compare a: ${String(a)}`);
    log(`Compare b: ${String(b)}`);

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
      const aLowestNodeId = minValue(Array.from(a._vector.keys()));
      const bLowestNodeId = minValue(Array.from(b._vector.keys()));
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

  static encode (value: LogicalClockStamp): dxos.echo.testing.ITimeframe {
    return {
      frames: value._entries().map(([feed, count]) => ({
        feedKey: BigIntToBuffer(feed),
        seq: count
      }))
    };
  }

  static decode (enc: dxos.echo.testing.ITimeframe) {
    assert(enc.frames);
    return new LogicalClockStamp(enc.frames.map(feed => {
      assert(feed.feedKey);
      assert(feed.seq);
      return [Buffer.from(feed.feedKey), feed.seq];
    }));
  }

  static max (a: LogicalClockStamp, b: LogicalClockStamp) {
    // TODO(burdon): Clone TS and modify.
    const res = new Map<bigint, number>(a._vector);
    for (const [key, count] of b._vector) {
      res.set(key, Math.max(res.get(key) ?? 0, count));
    }

    return new LogicalClockStamp(res);
  }

  // TODO(burdon): Not used?
  static fromObject (source: Record<string, number>): LogicalClockStamp {
    return new LogicalClockStamp(Object.entries(source).map(([key, seq]) => [Buffer.from(key), seq]));
  }

  // Map of sequence numbers indexed by feed key.
  private readonly _vector: Map<bigint, number>;

  // TODO(burdon): Disallow construction from map unless cloning from factory.
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

  private _entries () {
    return Array.from(this._vector.entries());
  }

  private _getSeqForNode (nodeId: bigint): number {
    const seq = this._vector.get(nodeId);
    return (seq === undefined) ? 0 : seq;
  }

  toString (): string {
    // TODO(dboreham): Use dxos/crypto for Buffer as Key.
    const values = this._entries().map(([key, value]) => `${BigIntToBuffer(key).toString('hex')}:${value}`).join(', ');
    return `[${values}]`;
  }

  // TODO(burdon): Remove: only used in tests?
  // TODO(burdon): How is this different from encode?
  // TODO(dboreham): Encoding scheme is a hack: use typed protocol buffer schema definition.
  toObject (): Record<string, number> {
    return objectFromEntries(this._entries().map(([key, value]) => [BigIntToBuffer(key).toString('hex'), value]));
  }

  // TODO(burdon): These methods use FeedKey instead of NodeId?

  // TODO(burdon): No test.
  withFeed (feedKey: FeedKey, seq: number) {
    const feedKeyInt = BufferToBigInt(feedKey as Buffer);

    // TODO(burdon): Filter and add as below.
    const mapClone = new Map(this._vector);
    mapClone.set(feedKeyInt, Math.max(mapClone.get(feedKeyInt) ?? 0, seq));
    return new LogicalClockStamp(mapClone);
  }

  // TODO(burdon): No test.
  withoutFeed (feedKey: FeedKey) {
    const feedKeyInt = BufferToBigInt(feedKey as Buffer);
    const vector = this._entries().filter(([key]) => key !== feedKeyInt);
    return new LogicalClockStamp(vector);
  }
}
