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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPartyMuxer = void 0;
var assert_1 = require("assert");
var debug_1 = require("debug");
var stream_1 = require("stream");
var crypto_1 = require("@dxos/crypto");
var clock_1 = require("../clock");
var pipeline_1 = require("../pipeline");
var util_1 = require("../util");
var log = debug_1.default('dxos:echo:party');
/**
 * Reads party feeds and routes to items demuxer.
 * @param feedStore
 * @param [initialFeeds]
 * @param [initialAnchor] TODO(burdon): Emit event when anchor point reached?
 */
exports.createPartyMuxer = function (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
feedStore, initialFeeds, initialAnchor) {
    // TODO(burdon): Is this the correct way to create a stream?
    var outputStream = new stream_1.Readable({ objectMode: true, read: function () { } });
    // Configure iterator with dynamic set of admitted feeds.
    var allowedFeeds = new Set(initialFeeds.map(function (feedKey) { return crypto_1.keyToString(feedKey); }));
    var currentTimestamp = new clock_1.LogicalClockStamp();
    // TODO(burdon): Explain control.
    setImmediate(function () { return __awaiter(void 0, void 0, void 0, function () {
        var iterator, iterator_1, iterator_1_1, _a, payload, key, seq, timestamp, e_1_1;
        var e_1, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, pipeline_1.FeedStoreIterator.create(feedStore, function (feedKey) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, allowedFeeds.has(crypto_1.keyToString(feedKey))];
                    }); }); }, function (candidates) {
                        for (var i = 0; i < candidates.length; i++) {
                            var payload = candidates[i].data.payload;
                            if (message.__type_url === 'dxos.echo.testing.ItemEnvelope') {
                                util_1.assumeType(message);
                                var timestamp = message.timestamp ? clock_1.LogicalClockStamp.decode(message.timestamp) : clock_1.LogicalClockStamp.zero();
                                var order = clock_1.LogicalClockStamp.compare(timestamp, currentTimestamp);
                                // if message's timestamp is <= the current observed timestamp we can pass the message through
                                // TODO(marik-d): Do we have to order messages agains each other?
                                if (order === clock_1.Order.EQUAL || order === clock_1.Order.BEFORE) {
                                    return i;
                                }
                            }
                            else {
                                return i; // pass through all non-ECHO messages
                            }
                        }
                        return undefined;
                    })];
                case 1:
                    iterator = _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 7, 8, 13]);
                    iterator_1 = __asyncValues(iterator);
                    _c.label = 3;
                case 3: return [4 /*yield*/, iterator_1.next()];
                case 4:
                    if (!(iterator_1_1 = _c.sent(), !iterator_1_1.done)) return [3 /*break*/, 6];
                    _a = iterator_1_1.value, payload = _a.data.payload, key = _a.key, seq = _a.seq;
                    log('Muxer:', JSON.stringify(message));
                    switch (message.__type_url) {
                        //
                        // HALO messages.
                        //
                        case 'dxos.echo.testing.PartyAdmit': {
                            util_1.assumeType(message);
                            assert_1.default(message.feedKey);
                            allowedFeeds.add(crypto_1.keyToString(message.feedKey));
                            break;
                        }
                        //
                        // ECHO messages.
                        //
                        case 'dxos.echo.testing.ItemEnvelope': {
                            util_1.assumeType(message);
                            assert_1.default(message.itemId);
                            timestamp = clock_1.LogicalClockStamp.zero().withFeed(key, seq);
                            currentTimestamp = clock_1.LogicalClockStamp.max(currentTimestamp, timestamp);
                            // TODO(burdon): Order by timestamp.
                            outputStream.push({ data: { payload: payload }, key: key, seq: seq });
                            // TODO(marik-d): Backpressure: https://nodejs.org/api/stream.html#stream_readable_push_chunk_encoding
                            // if (!this._output.push({ data: { payload } })) {
                            //   await new Promise(resolve => { this._output.once('drain', resolve )});
                            // }
                            break;
                        }
                        default:
                            console.warn("Skipping unknown message type " + message.__type_url);
                            break;
                    }
                    _c.label = 5;
                case 5: return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 13];
                case 7:
                    e_1_1 = _c.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 8:
                    _c.trys.push([8, , 11, 12]);
                    if (!(iterator_1_1 && !iterator_1_1.done && (_b = iterator_1.return))) return [3 /*break*/, 10];
                    return [4 /*yield*/, _b.call(iterator_1)];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 12: return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); });
    return outputStream;
};
