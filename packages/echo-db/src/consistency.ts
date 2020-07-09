//
// Copyright 2020 DxOS.org
//

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import assert from 'assert';
import debug from 'debug';

import { PartyFeeds } from './echo-feeds';

const log = debug('dxos.echo.consistency');

// TODO(dboreham): Separate abstract behavior from vector implementation.

// TODO(dboreham): Rationalize with FeedId.
type NodeId = Buffer;

// BigInt/Buffer conversion functions.
// From: https://coolaj86.com/articles/convert-js-bigints-to-typedarrays/
// Exported only for unit testing
// TODO(dboreham): Library or util?
export const BigIntToBuffer = (input: BigInt) => {
  let hex = BigInt(input).toString(16);
  if (hex.length % 2) { hex = '0' + hex; }

  const length = hex.length / 2;
  const u8 = new Uint8Array(length);

  let i = 0;
  let j = 0;
  while (i < length) {
    u8[i] = parseInt(hex.slice(j, j + 2), 16);
    i += 1;
    j += 2;
  }

  return Buffer.from(u8);
};

export const BufferToBigInt = (input: Buffer) => {
  // TODO(dboreham): Character array?
  var hex:string[] = [];
  const u8 = Uint8Array.from(input);

  u8.forEach((i) => {
    let h = i.toString(16);
    if (h.length % 2) { h = '0' + h; }
    hex.push(h);
  });

  return BigInt('0x' + hex.join(''));
};

export enum Order {
    CONCURRENT,
    EQUAL,
    BEFORE,
    AFTER
}

export const logOrder = (value: Order) => {
  switch (value) {
    case Order.BEFORE: return 'BEFORE';
    case Order.AFTER: return 'AFTER';
    case Order.EQUAL: return 'EQUAL';
    case Order.CONCURRENT: return 'CONCURRENT';
  }
};

const getLowestNodeId = (nodeIds: NodeId[]): NodeId => {
  const lowest:NodeId = nodeIds[0];
  // TODO(dboreham): Remove logging.
  nodeIds.forEach((nodeId) => { log(`id: ${nodeId.toString('hex')}`); });
  nodeIds.forEach((nodeId) => { if (nodeId < lowest) return lowest; });
  return lowest;
};

export class LogicalClockStamp {
    _vector: Map<NodeId, number>

    constructor () {
      this._vector = new Map();
    }

    static zero (): LogicalClockStamp {
      // Empty map from constructor means zero.
      return new LogicalClockStamp();
    }

    static compare (a: LogicalClockStamp, b: LogicalClockStamp): Order {
      log(`Compare a: ${a.log()}`);
      log(`Compare b: ${b.log()}`);
      const nodeIds: Set<NodeId> = new Set();
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
        if (aSeq > bSeq) {
          allGreaterThanOrEqual = false;
        }
        if (aSeq < bSeq) {
          allLessThanOrEqual = false;
        }
      }
      // if order is significant
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
        log(`aLowest: ${aLowestNodeId.toString('hex')}, bLowest: ${bLowestNodeId.toString('hex')}`);
        let tieBreaker = false;
        if (aLowestNodeId === bLowestNodeId) {
          // If the two share the same lowest node id use the seq for that node id to break tie.
          const aSeq = a._vector.get(aLowestNodeId);
          assert(aSeq);
          const bSeq = b._vector.get(bLowestNodeId);
          assert(bSeq);
          log(`tie: aSeq: ${aSeq}, bSeq:${bSeq} `);
          tieBreaker = aSeq < bSeq;
        } else {
          // Otherwise pick the stamp with the lowest node id.
          tieBreaker = aLowestNodeId < bLowestNodeId;
        }
        return tieBreaker ? Order.AFTER : Order.BEFORE;
      } else {
        return partialOrder;
      }
    }

    // TODO(dboreham): Encoding scheme is a hack : use typed protocol buffer schema definition.
    toObject (): object {
      return Array.from(this._vector.entries()).map(([key, value]) => { return { [key.toString('hex')]: value }; });
    }

    static fromObject (source: object): LogicalClockStamp {
      const vector = new Map();
      const result = new LogicalClockStamp();
      result._vector = vector;
      // TODO(dboreham): single-function to do this? Map.fromObject()?
      Object.entries(source).forEach(([key, value]) => { vector.set(key, value); });
      return result;
    }

    log (): string {
      // TODO(dboreham): Use DXOS lib for Buffer as Key.
      // TODO(dboreham): Way too functional.
      return Array.from(this._vector.entries()).map(([key, value]) => `${key.toString('hex')}:${value}`).join(', ');
    }

    // Package private methods
    _getSeqForNode (nodeId: NodeId): number {
      const seq = this._vector.get(nodeId);
      return (seq === undefined) ? 0 : seq;
    }

    _setSeqForNode (nodeId: NodeId, seq: number) {
      this._vector.set(nodeId, seq);
    }

    _setVector (vector: Map<NodeId, number>) {
      this._vector = vector;
    }
}

// TODO(dboreham): Add abstraction for testing.
export class LogicalClock {
    // Vector time stamp comes from current feed sequences
    // Needs to update feeds as new ones are added
    partyFeeds: PartyFeeds;

    constructor (partyFeeds: PartyFeeds) {
      this.partyFeeds = partyFeeds;
    }

    getCurrentStamp (): LogicalClockStamp {
      const vector = new Map();
      this.partyFeeds.getFeeds().map(feed => vector.set(feed.getKey(), feed.getSeq()));
      const lcs = new LogicalClockStamp();
      lcs._setVector(vector);
      return lcs;
    }
}
