"use strict";
//
// Copyright 2020 DXOS.org
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWritableFeedStream = exports.collect = void 0;
var stream_1 = require("stream");
/**
 * Turns a stream into constantly mutating array of all messages emmited by the stream.
 * Triggers stream consumption.
 * @param stream
 */
// TODO(burdon): Rename.
exports.collect = function (stream) {
    var array = [];
    stream.on('data', function (data) { array.push(data); });
    return array;
};
/**
 * Returns a stream that appends messages directly to a hypercore feed.
 * @param feed
 * @returns {NodeJS.WritableStream}
 */
exports.createWritableFeedStream = function (feed) { return new stream_1.Writable({
    objectMode: true,
    write: function (message, _, callback) {
        feed.append(message, callback);
    }
}); };
