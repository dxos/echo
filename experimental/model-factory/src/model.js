"use strict";
//
// Copyright 2020 DXOS.org
//
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const assert_1 = __importDefault(require("assert"));
const pify_1 = __importDefault(require("pify"));
const async_1 = require("@dxos/async");
const experimental_util_1 = require("@dxos/experimental-util");
/**
 * Abstract base class for Models.
 * Models define a root message type, which is contained in the partent Item's message envelope.
 */
class Model {
    /**
     * @param itemId Parent item.
     * @param writable Output mutation stream (unless read-only).
     */
    constructor(itemId, writable) {
        this._modelUpdate = new async_1.Event();
        assert_1.default(itemId);
        this._itemId = itemId;
        this._writable = writable;
        // Create the input mutation stream.
        this._processor = experimental_util_1.createWritable(async (message) => {
            const { meta, mutation } = message;
            assert_1.default(meta);
            assert_1.default(mutation);
            await this.processMessage(meta, mutation);
        });
    }
    get itemId() {
        return this._itemId;
    }
    get readOnly() {
        return this._writable === undefined;
    }
    // TODO(burdon): Rename.
    get processor() {
        return this._processor;
    }
    // TODO(burdon): How to subtype handler via polymorphic this types?
    subscribe(listener) {
        this._modelUpdate.on(listener);
        return () => {
            this._modelUpdate.off(listener);
        };
    }
    /**
     * Writes the raw mutation to the output stream.
     * @param mutation
     */
    async write(mutation) {
        if (!this._writable) {
            throw new Error(`Read-only model: ${this._itemId}`);
        }
        await pify_1.default(this._writable.write.bind(this._writable))(mutation);
    }
    async processMessage(meta, message) {
        const modified = await this._processMessage(meta, message);
        if (modified) {
            this._modelUpdate.emit(this);
        }
    }
}
exports.Model = Model;
//# sourceMappingURL=model.js.map