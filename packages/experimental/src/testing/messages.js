"use strict";
//
// Copyright 2020 DXOS.org
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpectedFeedMessage = exports.createTestMessageWithTimestamp = exports.createTestMessage = exports.createTestItemMutation = exports.createItemGenesis = exports.createPartyEject = exports.createPartyAdmit = void 0;
var logical_clock_stamp_1 = require("../../archive/clock/logical-clock-stamp");
var test_model_1 = require("./test-model");
//
// Test generators.
//
exports.createPartyAdmit = function (feedKey) { return ({
    payload: {
        __type_url: 'dxos.echo.testing.PartyAdmit',
        feedKey: feedKey
    }
}); };
exports.createPartyEject = function (feedKey) { return ({
    payload: {
        __type_url: 'dxos.echo.testing.PartyEject',
        feedKey: feedKey
    }
}); };
exports.createItemGenesis = function (itemId, itemType, timestamp) { return ({
    payload: {
        __type_url: 'dxos.echo.testing.ItemEnvelope',
        itemId: itemId,
        timestamp: timestamp ? logical_clock_stamp_1.LogicalClockStamp.encode(timestamp) : undefined,
        genesis: {
            itemType: itemType,
            modelType: test_model_1.TestModel.type
        }
    }
}); };
exports.createTestItemMutation = function (itemId, key, value, timestamp) { return ({
    payload: {
        __type_url: 'dxos.echo.testing.ItemEnvelope',
        itemId: itemId,
        timestamp: timestamp ? logical_clock_stamp_1.LogicalClockStamp.encode(timestamp) : undefined,
        operation: {
            __type_url: 'dxos.echo.testing.TestItemMutation',
            key: key,
            value: value
        }
    }
}); };
//
// Basic testing
//
exports.createTestMessage = function (value) { return ({
    payload: {
        __type_url: 'dxos.echo.testing.TestMessage',
        value: value
    }
}); };
exports.createTestMessageWithTimestamp = function (feedKey, timestamp, value) { return ({
    payload: {
        __type_url: 'dxos.echo.testing.ItemEnvelope',
        timestamp: logical_clock_stamp_1.LogicalClockStamp.encode(timestamp),
        operation: {
            __type_url: 'dxos.echo.testing.TestMessage',
            value: value
        }
    },
    feedKey: feedKey
}); };
exports.createExpectedFeedMessage = function (data) { return ({
    key: expect.any(Buffer),
    seq: expect.any(Number),
    sync: expect.any(Boolean),
    data: data
}); };
