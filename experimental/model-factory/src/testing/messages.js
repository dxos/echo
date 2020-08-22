"use strict";
//
// Copyright 2020 DXOS.org
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppendPropertyMutation = exports.createSetPropertyMutation = void 0;
const experimental_util_1 = require("@dxos/experimental-util");
exports.createSetPropertyMutation = (itemId, key, value, timeframe) => experimental_util_1.createMessage({
    echo: {
        timeframe,
        itemId,
        itemMutation: {
            set: {
                key,
                value
            }
        }
    }
});
exports.createAppendPropertyMutation = (itemId, key, value, timeframe) => experimental_util_1.createMessage({
    echo: {
        timeframe,
        itemId,
        itemMutation: {
            append: {
                key,
                value
            }
        }
    }
});
//# sourceMappingURL=messages.js.map