"use strict";
//
// Copyright 2020 DXOS.org
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonReplacer = void 0;
const crypto_1 = require("@dxos/crypto");
/**
 * JSON.stringify replacer.
 */
function jsonReplacer(key, value) {
    // TODO(burdon): Why is this represented as { type: 'Buffer', data }
    if (typeof value === 'object' && value.type === 'Buffer' && Array.isArray(value.data)) {
        const key = Buffer.from(value.data);
        return `[${crypto_1.humanize(key)}]:[${crypto_1.keyToString(key)}]`;
    }
    if (Array.isArray(value)) {
        return value.length;
    }
    else {
        return value;
    }
}
exports.jsonReplacer = jsonReplacer;
//# sourceMappingURL=json.js.map