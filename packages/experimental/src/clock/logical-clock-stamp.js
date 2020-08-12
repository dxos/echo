"use strict";
//
// Copyright 2020 DxOS.org
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicalClockStamp = exports.Order = exports.BufferToBigInt = exports.BigIntToBuffer = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var assert_1 = require("assert");
var debug_1 = require("debug");
var log = debug_1.default('dxos.echo.consistency');
// BigInt/Buffer conversion functions.
// From: https://coolaj86.com/articles/convert-js-bigints-to-typedarrays/
// Exported only for unit testing
// TODO(dboreham): Library or util?
exports.BigIntToBuffer = function (input) {
    var hex = BigInt(input).toString(16);
    if (hex.length % 2) {
        hex = '0' + hex;
    }
    var length = hex.length / 2;
    var u8 = new Uint8Array(length);
    var i = 0;
    var j = 0;
    while (i < length) {
        u8[i] = parseInt(hex.slice(j, j + 2), 16);
        i += 1;
        j += 2;
    }
    return Buffer.from(u8);
};
exports.BufferToBigInt = function (input) {
    // TODO(dboreham): Character array?
    var hex = [];
    var u8 = Uint8Array.from(input);
    u8.forEach(function (i) {
        var h = i.toString(16);
        if (h.length % 2) {
            h = '0' + h;
        }
        hex.push(h);
    });
    return BigInt('0x' + hex.join(''));
};
// https://www.typescriptlang.org/docs/handbook/enums.html
var Order;
(function (Order) {
    Order[Order["CONCURRENT"] = 0] = "CONCURRENT";
    Order[Order["EQUAL"] = 1] = "EQUAL";
    Order[Order["BEFORE"] = 2] = "BEFORE";
    Order[Order["AFTER"] = 3] = "AFTER";
})(Order = exports.Order || (exports.Order = {}));
var getLowestNodeId = function (nodeIds) {
    return nodeIds.reduce(function (min, curr) { return curr < min ? curr : min; }, nodeIds[0]);
};
// TODO(burdon): Rename.
var LogicalClockStamp = /** @class */ (function () {
    function LogicalClockStamp(data) {
        if (data === void 0) { data = []; }
        if (data instanceof Map) {
            this._vector = data;
        }
        else {
            this._vector = new Map(data.map(function (_a) {
                var nodeId = _a[0], seq = _a[1];
                return [typeof nodeId !== 'bigint' ? exports.BufferToBigInt(nodeId) : nodeId, seq];
            }));
        }
    }
    LogicalClockStamp.zero = function () {
        // Empty map from constructor means zero.
        return new LogicalClockStamp();
    };
    LogicalClockStamp.compare = function (a, b) {
        log("Compare a: " + a.log());
        log("Compare b: " + b.log());
        var nodeIds = new Set();
        // TODO(dboreham): set.addAllFrom(Iteraable)? or set.union(a,b)?
        for (var _i = 0, _a = a._vector.keys(); _i < _a.length; _i++) {
            var key = _a[_i];
            nodeIds.add(key);
        }
        for (var _b = 0, _c = b._vector.keys(); _b < _c.length; _b++) {
            var key = _c[_b];
            nodeIds.add(key);
        }
        var allGreaterThanOrEqual = true;
        var allLessThanOrEqual = true;
        var allEqual = true;
        for (var _d = 0, nodeIds_1 = nodeIds; _d < nodeIds_1.length; _d++) {
            var nodeId = nodeIds_1[_d];
            var aSeq = a._getSeqForNode(nodeId);
            var bSeq = b._getSeqForNode(nodeId);
            // TODO(dboreham): Remove logging when debugged.
            log("aSeq:" + aSeq + " bSeq:" + bSeq);
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
        // if order is significant
        if (allEqual) {
            return Order.EQUAL;
        }
        else if (allGreaterThanOrEqual) {
            return Order.AFTER;
        }
        else if (allLessThanOrEqual) {
            return Order.BEFORE;
        }
        else {
            return Order.CONCURRENT;
        }
    };
    LogicalClockStamp.totalCompare = function (a, b) {
        var partialOrder = LogicalClockStamp.compare(a, b);
        if (partialOrder === Order.CONCURRENT) {
            var aLowestNodeId = getLowestNodeId(Array.from(a._vector.keys()));
            var bLowestNodeId = getLowestNodeId(Array.from(b._vector.keys()));
            log("aLowest: " + exports.BigIntToBuffer(aLowestNodeId).toString('hex') + ", bLowest: " + exports.BigIntToBuffer(bLowestNodeId).toString('hex'));
            if (aLowestNodeId === bLowestNodeId) {
                // If the two share the same lowest node id use the seq for that node id to break tie.
                var aSeq = a._vector.get(aLowestNodeId);
                assert_1.default(aSeq);
                var bSeq = b._vector.get(bLowestNodeId);
                assert_1.default(bSeq);
                log("tie: aSeq: " + aSeq + ", bSeq:" + bSeq + " ");
                return aSeq < bSeq ? Order.AFTER : Order.BEFORE;
            }
            else {
                // Otherwise pick the stamp with the lowest node id.
                return aLowestNodeId < bLowestNodeId ? Order.AFTER : Order.BEFORE;
            }
        }
        else {
            return partialOrder;
        }
    };
    LogicalClockStamp.prototype._entries = function () {
        return Array.from(this._vector.entries());
    };
    // TODO(dboreham): Encoding scheme is a hack : use typed protocol buffer schema definition.
    LogicalClockStamp.prototype.toObject = function () {
        return objectFromEntries(this._entries().map(function (_a) {
            var key = _a[0], value = _a[1];
            return [exports.BigIntToBuffer(key).toString('hex'), value];
        }));
    };
    LogicalClockStamp.fromObject = function (source) {
        return new LogicalClockStamp(Object.entries(source).map(function (_a) {
            var key = _a[0], seq = _a[1];
            return [Buffer.from(key), seq];
        }));
    };
    LogicalClockStamp.encode = function (value) {
        return {
            timestamp: value._entries().map(function (_a) {
                var feed = _a[0], count = _a[1];
                return ({
                    feedKey: exports.BigIntToBuffer(feed),
                    seq: count
                });
            })
        };
    };
    LogicalClockStamp.decode = function (enc) {
        assert_1.default(enc.timestamp);
        return new LogicalClockStamp(enc.timestamp.map(function (feed) {
            assert_1.default(feed.feedKey);
            assert_1.default(feed.seq);
            return [Buffer.from(feed.feedKey), feed.seq];
        }));
    };
    LogicalClockStamp.prototype.log = function () {
        // TODO(dboreham): Use DXOS lib for Buffer as Key.
        return this._entries().map(function (_a) {
            var key = _a[0], value = _a[1];
            return exports.BigIntToBuffer(key).toString('hex') + ":" + value;
        }).join(', ');
    };
    LogicalClockStamp.prototype._getSeqForNode = function (nodeId) {
        var seq = this._vector.get(nodeId);
        return (seq === undefined) ? 0 : seq;
    };
    LogicalClockStamp.max = function (a, b) {
        var _a;
        var res = new Map(a._vector);
        for (var _i = 0, _b = b._vector; _i < _b.length; _i++) {
            var _c = _b[_i], key = _c[0], count = _c[1];
            res.set(key, Math.max((_a = res.get(key)) !== null && _a !== void 0 ? _a : 0, count));
        }
        return new LogicalClockStamp(res);
    };
    LogicalClockStamp.prototype.withoutFeed = function (feedKey) {
        var feedKeyInt = exports.BufferToBigInt(feedKey);
        return new LogicalClockStamp(this._entries().filter(function (_a) {
            var key = _a[0], value = _a[1];
            return key !== feedKeyInt;
        }));
    };
    LogicalClockStamp.prototype.withFeed = function (feedKey, seq) {
        var _a;
        var feedKeyInt = exports.BufferToBigInt(feedKey);
        var mapClone = new Map(this._vector);
        mapClone.set(feedKeyInt, Math.max((_a = mapClone.get(feedKeyInt)) !== null && _a !== void 0 ? _a : 0, seq));
        return new LogicalClockStamp(mapClone);
    };
    return LogicalClockStamp;
}());
exports.LogicalClockStamp = LogicalClockStamp;
function objectFromEntries(entries) {
    var res = {};
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var _a = entries_1[_i], key = _a[0], val = _a[1];
        res[key] = val;
    }
    return res;
}
