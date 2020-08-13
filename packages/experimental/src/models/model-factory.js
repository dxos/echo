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
    // TODO(burdon): Require version.
    ModelFactory.prototype.hasModel = function (modelType) {
        assert_1.default(modelType);
        return this._models.has(modelType);
    };
    ModelFactory.prototype.registerModel = function (modelType, modelConstructor) {
        assert_1.default(modelType);
        assert_1.default(modelConstructor);
        this._models.set(modelType, modelConstructor);
        return this;
    };
    ModelFactory.prototype.createModel = function (modelType, itemId, readable, writable) {
        var modelConstructor = this._models.get(modelType);
        if (modelConstructor) {
            // eslint-disable-next-line new-cap
            return new modelConstructor(itemId, readable, writable);
        }
    };
    return ModelFactory;
}());
exports.ModelFactory = ModelFactory;
