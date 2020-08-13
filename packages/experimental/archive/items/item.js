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
var events_1 = require("events");
// TODO(burdon): Create item stream tests first (for both system and user models).
// TODO(burdon): Item should create stream (for local and user model).
/**
 * Data item.
 */
var Item = /** @class */ (function (_super) {
    __extends(Item, _super);
    function Item(_itemId, _itemType, _model) {
        var _this = _super.call(this) || this;
        _this._itemId = _itemId;
        _this._itemType = _itemType;
        _this._model = _model;
        assert_1.default(_this._itemId);
        assert_1.default(_this._itemType);
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
            return this._itemType;
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
