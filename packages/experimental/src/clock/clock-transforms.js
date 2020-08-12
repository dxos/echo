"use strict";
//
// Copyright 2020 DXOS.org
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimestampTransforms = void 0;
var debug_1 = require("debug");
var stream_1 = require("stream");
var logical_clock_stamp_1 = require("./logical-clock-stamp");
var util_1 = require("../util");
var log = debug_1.default('dxos:echo:muxer');
/**
 *
 */
exports.createTimestampTransforms = function (writeFeedKey) {
    var currentTimestamp = new logical_clock_stamp_1.LogicalClockStamp();
    var inboundTransform = new stream_1.Transform({
        objectMode: true,
        // TODO(burdon): Rename message.
        transform: function (chunk, encoding, callback) {
            var message = chunk.data.message;
            util_1.assertAnyType(message, 'dxos.echo.testing.ItemEnvelope');
            var timestamp = (message.timestamp
                ? logical_clock_stamp_1.LogicalClockStamp.decode(message.timestamp)
                : logical_clock_stamp_1.LogicalClockStamp.zero()).withFeed(chunk.key, chunk.seq);
            currentTimestamp = logical_clock_stamp_1.LogicalClockStamp.max(currentTimestamp, timestamp);
            log("Current timestamp: " + currentTimestamp.log());
            callback(null, chunk);
        }
    });
    var outboundTransform = new stream_1.Transform({
        objectMode: true,
        // TODO(burdon): Rename message.
        transform: function (chunk, encoding, callback) {
            var message = chunk.message;
            util_1.assertAnyType(message, 'dxos.echo.testing.ItemEnvelope');
            message.timestamp = logical_clock_stamp_1.LogicalClockStamp.encode(currentTimestamp.withoutFeed(writeFeedKey));
            callback(null, chunk);
        }
    });
    return [inboundTransform, outboundTransform];
};
