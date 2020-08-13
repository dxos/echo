"use strict";
//
// Copyright 2020 DXOS.org
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTimestampTransforms = void 0;
var assert_1 = require("assert");
var debug_1 = require("debug");
var stream_1 = require("stream");
var logical_clock_stamp_1 = require("./logical-clock-stamp");
var util_1 = require("@dxos/experimental/dist/util");
var log = debug_1.default('dxos:echo:clock');
/**
 * Create inbound and oubound transformers to process the timestamp.
 */
exports.createTimestampTransforms = function (writeFeedKey) {
    var currentTimestamp = new logical_clock_stamp_1.LogicalClockStamp();
    //
    // Get up-to-date timestamp from inbound stream.
    //
    var inboundTransform = new stream_1.Transform({
        objectMode: true,
        transform: function (message, encoding, callback) {
            util_1.assertAnyType(message, 'dxos.echo.testing.FeedStream');
            assert_1.default(message.meta && message.data && message.data.echo);
            var _a = message.meta, feedKey = _a.feedKey, seq = _a.seq, timestamp = message.data.echo.timestamp;
            var newTimestamp = (timestamp ? logical_clock_stamp_1.LogicalClockStamp.decode(timestamp) : logical_clock_stamp_1.LogicalClockStamp.zero())
                .withFeed(feedKey, seq);
            currentTimestamp = logical_clock_stamp_1.LogicalClockStamp.max(currentTimestamp, newTimestamp);
            log("Inbound: " + currentTimestamp.log());
            callback(null, message);
        }
    });
    //
    // Write current timestamp to outbound stream.
    //
    var outboundTransform = new stream_1.Transform({
        objectMode: true,
        transform: function (object, encoding, callback) {
            util_1.assertAnyType(object, 'dxos.echo.testing.EchoEnvelope');
            var timestamp = currentTimestamp.withoutFeed(writeFeedKey);
            log("Outbound: " + timestamp.log());
            callback(null, Object.assign(object, { timestamp: logical_clock_stamp_1.LogicalClockStamp.encode(timestamp) }));
        }
    });
    return [inboundTransform, outboundTransform];
};
