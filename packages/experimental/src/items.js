"use strict";
//
// Copyright 2020 DXOS.org
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
var crypto_1 = require("@dxos/crypto");
/**
 * Item
 */
var Item = /** @class */ (function () {
    function Item(_type) {
        this._type = _type;
        this._id = crypto_1.createId();
    }
    Object.defineProperty(Item.prototype, "id", {
        get: function () {
            return this._id;
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
    return Item;
}());
exports.Item = Item;
