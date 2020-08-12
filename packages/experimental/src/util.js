"use strict";
//
// Copyright 2020 DXOS.org
//
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Trigger = exports.LazyMap = exports.assertAnyType = exports.assertTypeUrl = exports.assumeType = exports.latch = exports.sink = void 0;
var assert_1 = require("assert");
var async_1 = require("@dxos/async");
/**
 * Waits for the specified number of events from the given emitter.
 * @param emitter
 * @param event
 * @param count
 */
// TODO(burdon): Factor out to @dxos/async. (also remove useValue).
exports.sink = function (emitter, event, count) {
    if (count === void 0) { count = 1; }
    var resolver;
    var counter = 0;
    var listener = function () {
        if (++counter === count) {
            emitter.off(event, listener);
            resolver();
        }
    };
    emitter.on(event, listener);
    return new Promise(function (resolve) { resolver = resolve; });
};
// TODO(burdon): Factor out to @dxos/async. (also remove useValue).
exports.latch = function (n) {
    assert_1.default(n > 0);
    var callback;
    var promise = new Promise(function (resolve) {
        callback = function (value) { return resolve(value); };
    });
    var count = 0;
    return [
        promise,
        function () {
            if (++count === n) {
                callback(count);
            }
        }
    ];
};
/**
 * A simple syntax sugar to write `value as T` as a statement.
 *
 * NOTE: This does not provide any type safety.
 * It's just for convinience so that autocomplete works for value.
 * It's recomended to check the type URL mannuly beforehand or use `assertAnyType` instead.
 * @param value
 */
// TODO(marik_d): Extract somewhere.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assumeType(value) { }
exports.assumeType = assumeType;
function assertTypeUrl(value, typeUrl) {
    assert_1.default(value.__type_url === typeUrl, "Expected message with type URL `" + typeUrl + "` instead got `" + value.__type_url + "`");
}
exports.assertTypeUrl = assertTypeUrl;
/**
 * Checks the type of messages that come from `google.protobuf.Any` encoding.
 *
 * ## Usage example:
 * ```
 * assertAnyType<dxos.echo.testing.IItemEnvelope>(message, 'dxos.echo.testing.ItemEnvelope');
 * ```
 * @param value
 * @param typeUrl
 */
function assertAnyType(value, typeUrl) {
    assertTypeUrl(value, typeUrl);
}
exports.assertAnyType = assertAnyType;
// TODO(marik_d): Extract somewhere.
var LazyMap = /** @class */ (function (_super) {
    __extends(LazyMap, _super);
    function LazyMap(_initFn) {
        var _this = _super.call(this) || this;
        _this._initFn = _initFn;
        return _this;
    }
    LazyMap.prototype.getOrInit = function (key) {
        assert_1.default(key);
        if (this.has(key)) {
            return this.get(key);
        }
        else {
            var value = this._initFn(key);
            this.set(key, value);
            return value;
        }
    };
    return LazyMap;
}(Map));
exports.LazyMap = LazyMap;
var Trigger = /** @class */ (function () {
    function Trigger() {
        this.reset();
    }
    Trigger.prototype.wait = function () {
        return this._promise;
    };
    Trigger.prototype.wake = function () {
        this._wake();
    };
    Trigger.prototype.reset = function () {
        var _a = async_1.trigger(), getPromise = _a[0], wake = _a[1];
        this._promise = getPromise();
        this._wake = wake;
    };
    return Trigger;
}());
exports.Trigger = Trigger;
