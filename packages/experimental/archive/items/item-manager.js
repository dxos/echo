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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemManager = void 0;
var assert_1 = require("assert");
var debug_1 = require("debug");
var pify_1 = require("pify");
var events_1 = require("events");
var stream_1 = require("stream");
var async_1 = require("@dxos/async");
var crypto_1 = require("@dxos/crypto");
var item_1 = require("./item");
var log = debug_1.default('dxos:echo:item');
/**
 * Manages creation and index of items.
 */
var ItemManager = /** @class */ (function (_super) {
    __extends(ItemManager, _super);
    function ItemManager(_modelFactory, _writable) {
        var _this = _super.call(this) || this;
        _this._modelFactory = _modelFactory;
        _this._writable = _writable;
        // Map of active items.
        _this._items = new Map();
        // TODO(burdon): Lint issue: Unexpected whitespace between function name and paren
        // Map of item promises (waiting for item construction after genesis message has been written).
        // eslint-disable-next-line
        _this._pendingItems = new Map();
        assert_1.default(_this._modelFactory);
        assert_1.default(_this._writable);
        return _this;
    }
    /**
     * Creates an item and writes the genesis message.
     * @param itemType item type
     * @param modelType model type
     */
    ItemManager.prototype.createItem = function (itemType, modelType) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, waitForCreation, callback, itemId, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        assert_1.default(itemType);
                        assert_1.default(modelType);
                        _a = async_1.trigger(), waitForCreation = _a[0], callback = _a[1];
                        itemId = crypto_1.createId();
                        this._pendingItems.set(itemId, callback);
                        // Write Item Genesis block.
                        log('Writing Genesis:', itemId);
                        message = {
                            itemId: itemId,
                            genesis: {
                                itemType: itemType,
                                modelType: modelType
                            }
                        };
                        return [4 /*yield*/, pify_1.default(this._writable.write.bind(this._writable))(message)];
                    case 1:
                        _b.sent();
                        // Unlocked by construct.
                        log('Waiting for item...');
                        return [4 /*yield*/, waitForCreation()];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    /**
     * Constructs an item with the appropriate model.
     * @param itemId
     * @param itemType
     * @param modelType
     * @param readable
     */
    ItemManager.prototype.constructItem = function (itemId, itemType, modelType, readable) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var transform, model, item;
            var _this = this;
            return __generator(this, function (_b) {
                assert_1.default(itemId);
                assert_1.default(itemType);
                assert_1.default(modelType);
                assert_1.default(readable);
                // TODO(burdon): Skip genesis message (and subsequent messages) if unknown model. Build map of ignored items.
                if (this._modelFactory.hasModel(modelType)) {
                    throw new Error("Unknown model: " + modelType);
                }
                transform = new stream_1.Transform({
                    objectMode: true,
                    transform: function (message, _, callback) {
                        callback(null, {
                            itemId: itemId,
                            operation: message
                        });
                    }
                });
                // Connect streams.
                transform.pipe(this._writable);
                model = this._modelFactory.createModel(modelType, itemId, readable, transform);
                assert_1.default(model, "Invalid model: " + modelType);
                item = new item_1.Item(itemId, itemType, model);
                assert_1.default(!this._items.has(itemId));
                this._items.set(itemId, item);
                log('Constructed Item:', JSON.stringify(item));
                // Item udpated.
                model.on('update', function () {
                    item.emit('update', item);
                    _this.emit('update', item);
                });
                // Notify pending creates.
                (_a = this._pendingItems.get(itemId)) === null || _a === void 0 ? void 0 : _a(item);
                this.emit('create', item);
                return [2 /*return*/, item];
            });
        });
    };
    /**
     * Retrieves a data item from the index.
     * @param itemId
     */
    ItemManager.prototype.getItem = function (itemId) {
        return this._items.get(itemId);
    };
    /**
     * Return matching items.
     * @param [filter]
     */
    ItemManager.prototype.getItems = function (filter) {
        if (filter === void 0) { filter = {}; }
        var type = filter.type;
        return Array.from(this._items.values()).filter(function (item) { return !type || item.type === type; });
    };
    return ItemManager;
}(events_1.EventEmitter));
exports.ItemManager = ItemManager;
