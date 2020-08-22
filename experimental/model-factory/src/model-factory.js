"use strict";
//
// Copyright 2020 DXOS.org
//
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelFactory = void 0;
const assert_1 = __importDefault(require("assert"));
/**
 * Creates Model instances from a registered collection of Model types.
 */
class ModelFactory {
    constructor() {
        this._models = new Map();
    }
    // TODO(burdon): Require version.
    hasModel(modelType) {
        assert_1.default(modelType);
        return this._models.has(modelType);
    }
    registerModel(modelType, modelConstructor) {
        assert_1.default(modelType);
        assert_1.default(modelConstructor);
        this._models.set(modelType, modelConstructor);
        return this;
    }
    createModel(modelType, itemId, writable) {
        assert_1.default(itemId);
        const modelConstructor = this._models.get(modelType);
        if (!modelConstructor) {
            throw new Error(`Invalid model type: ${modelType}`);
        }
        // eslint-disable-next-line new-cap
        return new modelConstructor(itemId, writable);
    }
}
exports.ModelFactory = ModelFactory;
//# sourceMappingURL=model-factory.js.map