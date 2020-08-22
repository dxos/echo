"use strict";
//
// Copyright 2020 DXOS.org
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestModel = void 0;
const experimental_util_1 = require("@dxos/experimental-util");
const model_1 = require("../model");
/**
 * Test model.
 */
class TestModel extends model_1.Model {
    constructor() {
        super(...arguments);
        this._values = new Map();
    }
    get keys() {
        return Array.from(this._values.keys());
    }
    get properties() {
        return Object.fromEntries(this._values);
    }
    getProperty(key) {
        return this._values.get(key);
    }
    async setProperty(key, value) {
        await this.write(experimental_util_1.createMessage({
            set: {
                key,
                value
            }
        }, 'dxos.echo.testing.TestItemMutation'));
    }
    async appendProperty(key, value) {
        await this.write(experimental_util_1.createMessage({
            append: {
                key,
                value
            }
        }, 'dxos.echo.testing.TestItemMutation'));
    }
    async _processMessage(meta, message) {
        if (message.set) {
            const { set: { key, value } } = message;
            this._values.set(key, value);
        }
        if (message.append) {
            const { append: { key, value } } = message;
            const current = this._values.get(key) || '';
            this._values.set(key, current + ':' + value);
        }
        return true;
    }
}
exports.TestModel = TestModel;
TestModel.type = 'wrn://dxos.org/model/test';
//# sourceMappingURL=test-model.js.map