"use strict";
//
// Copyright 2020 DXOS.org
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelFactory = void 0;
var assert_1 = require("assert");
var debug_1 = require("debug");
var log = debug_1.default('dxos:echo:model');
/**
 * Creates Model instances from a registered collection of Model types.
 */
var ModelFactory = /** @class */ (function () {
    function ModelFactory() {
        this._models = new Map();
    }
    ModelFactory.prototype.registerModel = function (type, modelConstructor) {
        assert_1.default(type);
        assert_1.default(modelConstructor);
        this._models.set(type, modelConstructor);
        return this;
    };
    // TODO(burdon): Require version.
    ModelFactory.prototype.createModel = function (type, itemId, readable, writable) {
        var modelConstructor = this._models.get(type);
        if (modelConstructor) {
            // eslint-disable-next-line new-cap
            return new modelConstructor(itemId, readable, writable);
        }
    };
    return ModelFactory;
}());
exports.ModelFactory = ModelFactory;
