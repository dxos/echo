"use strict";
//
// Copyright 2020 DXOS.org
//
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
exports.createItemDemuxer = void 0;
var assert_1 = require("assert");
var debug_1 = require("debug");
var stream_1 = require("stream");
var util_1 = require("@dxos/experimental/dist/util");
var log = debug_1.default('dxos:echo:item');
/**
 * Creates a stream that consumes item messages.
 * @param itemManager
 */
exports.createItemDemuxer = function (itemManager) {
    // TODO(burdon): Get stream from item's model directly.
    // TODO(burdon): Should be impossible to get message before stream is created.
    // Map of Item-specific streams.
    var itemStreamMap = new util_1.LazyMap(function () { return new stream_1.Readable({
        objectMode: true,
        read: function () { }
    }); });
    var process = function (meta, message) { return __awaiter(void 0, void 0, void 0, function () {
        var itemId, genesis, mutation, itemStream, itemType, modelType, item;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    itemId = message.itemId, genesis = message.genesis, mutation = message.mutation;
                    assert_1.default(itemId);
                    itemStream = itemStreamMap.getOrInit(itemId);
                    if (!genesis) return [3 /*break*/, 2];
                    itemType = genesis.itemType, modelType = genesis.modelType;
                    assert_1.default(itemType && modelType);
                    return [4 /*yield*/, itemManager.constructItem(itemId, itemType, modelType, itemStream)];
                case 1:
                    item = _a.sent();
                    assert_1.default(item.id === itemId);
                    return [2 /*return*/];
                case 2:
                    if (!mutation) return [3 /*break*/, 4];
                    return [4 /*yield*/, itemStream.push({ meta: meta, mutation: mutation })];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
                case 4: throw new Error("Unexpected message: " + JSON.stringify(message));
            }
        });
    }); };
    // TODO(burdon): Should this implement some "back-pressure" (hints) to the PartyProcessor?
    return new stream_1.Writable({
        objectMode: true,
        write: function (message, _, callback) { return __awaiter(void 0, void 0, void 0, function () {
            var meta, echo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log('Demuxer.write:', JSON.stringify(message));
                        assert_1.default(message.data && message.data.echo);
                        meta = message.meta, echo = message.data.echo;
                        return [4 /*yield*/, process(meta, echo)];
                    case 1:
                        _a.sent();
                        callback();
                        return [2 /*return*/];
                }
            });
        }); }
    });
};
