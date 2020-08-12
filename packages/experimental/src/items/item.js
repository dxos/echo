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
exports.Item = void 0;
var assert_1 = require("assert");
var debug_1 = require("debug");
var events_1 = require("events");
var log = debug_1.default('dxos:echo:item');
/**
 * Data item.
 */
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item(_itemId, _type, _model) {
        var _this = _super.call(this) || this;
        _this._itemId = _itemId;
        _this._type = _type;
        _this._model = _model;
        assert_1.default(_this._itemId);
        assert_1.default(_this._type);
        assert_1.default(_this._model);
        return _this;
    }
    Object.defineProperty(Item.prototype, "id", {
        get: function () {
            return this._itemId;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Item.prototype, "model", {
        get: function () {
            return this._model;
        },
        enumerable: false,
        configurable: true
    });
    return Item;
}(events_1.EventEmitter));
exports.Item = Item;
