"use strict";
//
// Copyright 2020 DXOS.org
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.WritableArray = exports.createLoggingTransform = exports.createTransform = exports.createPassThrough = exports.createWritable = exports.createReadable = exports.createMessage = void 0;
const stream_1 = require("stream");
//
// Stream utils.
// https://nodejs.org/api/stream.html
//
/**
 * Creates a statically checked message, with optional ANY type.
 * @param data
 * @param typeUrl
 */
// TODO(burdon): Move to @dxos/codec.
function createMessage(data, typeUrl) {
    return typeUrl ? Object.assign({
        __type_url: typeUrl
    }, data) : data;
}
exports.createMessage = createMessage;
/**
 * Creates a readable stream that can be used as a buffer into which messages can be pushed.
 */
function createReadable() {
    return new stream_1.Readable({
        objectMode: true,
        read() { }
    });
}
exports.createReadable = createReadable;
/**
 * Creates a writable object stream.
 * @param callback
 */
function createWritable(callback) {
    return new stream_1.Writable({
        objectMode: true,
        write: async (message, _, next) => {
            try {
                await callback(message);
                next();
            }
            catch (err) {
                next(err);
            }
        }
    });
}
exports.createWritable = createWritable;
/**
 * Creates a no-op transform.
 */
function createPassThrough() {
    return new stream_1.PassThrough({
        objectMode: true,
        transform: async (message, _, next) => {
            next(null, message);
        }
    });
}
exports.createPassThrough = createPassThrough;
/**
 * Creates a transform object stream.
 * @param [callback] Callback or null to pass-through.
 */
function createTransform(callback) {
    return new stream_1.Transform({
        objectMode: true,
        transform: async (message, _, next) => {
            try {
                next(null, callback ? await callback(message) : message);
            }
            catch (err) {
                next(err);
            }
        }
    });
}
exports.createTransform = createTransform;
/**
 * Injectable logger.
 * @param logger
 */
function createLoggingTransform(logger = console.log) {
    return createTransform(message => {
        logger(message);
        return message;
    });
}
exports.createLoggingTransform = createLoggingTransform;
/**
 * Wriable stream that collects objects (e.g., for testing).
 */
class WritableArray extends stream_1.Writable {
    constructor() {
        super({ objectMode: true });
        this._objects = [];
    }
    clear() {
        this._objects = [];
    }
    get objects() {
        return this._objects;
    }
    _write(object, _, next) {
        this._objects.push(object);
        next();
    }
}
exports.WritableArray = WritableArray;
//# sourceMappingURL=stream.js.map