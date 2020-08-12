"use strict";
//
// Copyright 2020 DXOS.org
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultSet = void 0;
var async_1 = require("@dxos/async");
/**
 * Query results.
 */
var ResultSet = /** @class */ (function () {
    function ResultSet(_event, _getter) {
        var _this = this;
        this._event = _event;
        this._getter = _getter;
        this._update = new async_1.Event();
        this._value = this._getter();
        this._handleUpdate = function () {
            _this._value = _this._getter();
            _this._update.emit(_this._value);
        };
    }
    Object.defineProperty(ResultSet.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Subscribe for updates.
     * @param listener
     */
    ResultSet.prototype.subscribe = function (listener) {
        var _this = this;
        this._update.on(listener);
        if (this._update.listenerCount() === 1) {
            this._event.on(this._handleUpdate);
        }
        return function () {
            _this._update.off(listener);
            if (_this._update.listenerCount() === 0) {
                _this._event.off(_this._handleUpdate);
            }
        };
    };
    return ResultSet;
}());
exports.ResultSet = ResultSet;
