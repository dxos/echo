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
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedStoreIterator = void 0;
var assert_1 = require("assert");
var stream_1 = require("stream");
var feed_store_1 = require("@dxos/feed-store");
var util_1 = require("../../src/util");
/**
 * We are using an iterator here instead of a stream to ensure we have full control over how and at what time
 * data is read. This allows the consumer (e.g., PartyProcessor) to control the order in which data is generated.
 * (Streams would not be suitable since NodeJS streams have intenal buffer that the system tends to eagerly fill.)
 */
var FeedStoreIterator = /** @class */ (function () {
    function FeedStoreIterator(_feedSelector, _messageOrderer) {
        this._feedSelector = _feedSelector;
        this._messageOrderer = _messageOrderer;
        this._candidateFeeds = new Set();
        /** Feed key as hex => feed state */
        this._openFeeds = new Map();
        this._trigger = new util_1.Trigger();
        this._messageCount = 0; // Needed for round-robin ordering.
        this._destroyed = false;
        this._generatorInstance = this._generator();
    }
    // TODO(burdon): Export function.
    FeedStoreIterator.create = function (feedStore, feedSelector, messageOrderer) {
        if (messageOrderer === void 0) { messageOrderer = function () { return 0; }; }
        return __awaiter(this, void 0, void 0, function () {
            var initialDescriptors, iterator, _i, initialDescriptors_1, descriptor;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (feedStore.closing || feedStore.closed) {
                            throw new Error('FeedStore closed');
                        }
                        if (!!feedStore.opened) return [3 /*break*/, 2];
                        return [4 /*yield*/, feedStore.ready()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        initialDescriptors = feedStore.getDescriptors().filter(function (descriptor) { return descriptor.opened; });
                        iterator = new FeedStoreIterator(feedSelector, messageOrderer);
                        for (_i = 0, initialDescriptors_1 = initialDescriptors; _i < initialDescriptors_1.length; _i++) {
                            descriptor = initialDescriptors_1[_i];
                            iterator._trackDescriptor(descriptor);
                        }
                        // Subscribe to new feeds.
                        // TODO(burdon): Need to test belong to party.
                        feedStore.on('feed', function (_, descriptor) {
                            iterator._trackDescriptor(descriptor);
                        });
                        return [2 /*return*/, iterator];
                }
            });
        });
    };
    FeedStoreIterator.prototype._reevaluateFeeds = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, _b, keyHex, feed, _c, _d, descriptor, stream;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _i = 0, _a = this._openFeeds;
                        _e.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        _b = _a[_i], keyHex = _b[0], feed = _b[1];
                        return [4 /*yield*/, this._feedSelector(feed.descriptor.key)];
                    case 2:
                        if (!(_e.sent())) {
                            feed.frozen = true;
                        }
                        _e.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        _c = 0, _d = Array.from(this._candidateFeeds.values());
                        _e.label = 5;
                    case 5:
                        if (!(_c < _d.length)) return [3 /*break*/, 8];
                        descriptor = _d[_c];
                        return [4 /*yield*/, this._feedSelector(descriptor.key)];
                    case 6:
                        if (_e.sent()) {
                            stream = new stream_1.Readable({ objectMode: true })
                                .wrap(feed_store_1.createBatchStream(descriptor.feed, { live: true }));
                            this._openFeeds.set(descriptor.key.toString('hex'), {
                                descriptor: descriptor,
                                iterator: stream[Symbol.asyncIterator](),
                                frozen: false,
                                sendQueue: []
                            });
                            this._candidateFeeds.delete(descriptor);
                        }
                        _e.label = 7;
                    case 7:
                        _c++;
                        return [3 /*break*/, 5];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    FeedStoreIterator.prototype._popSendQueue = function () {
        var openFeeds = Array.from(this._openFeeds.values());
        var candidates = openFeeds
            .filter(function (feed) { return !feed.frozen && feed.sendQueue.length > 0; })
            .map(function (feed) { return feed.sendQueue[0]; });
        if (candidates.length === 0) {
            return undefined;
        }
        var selected = this._messageOrderer(candidates);
        if (selected === undefined) {
            return undefined;
        }
        var pickedCandidate = candidates[selected];
        var feed = this._openFeeds.get(pickedCandidate.key.toString('hex'));
        assert_1.default(feed);
        return feed.sendQueue.shift();
    };
    FeedStoreIterator.prototype._pollFeeds = function () {
        var _this = this;
        var _loop_1 = function (keyHex, feed) {
            if (feed.sendQueue.length === 0) {
                feed.iterator.next().then(function (result) {
                    var _a;
                    assert_1.default(!result.done);
                    (_a = feed.sendQueue).push.apply(_a, result.value);
                    _this._trigger.wake();
                }, console.error // TODO(marik-d): Proper error handling
                );
            }
        };
        for (var _i = 0, _a = this._openFeeds; _i < _a.length; _i++) {
            var _b = _a[_i], keyHex = _b[0], feed = _b[1];
            _loop_1(keyHex, feed);
        }
    };
    FeedStoreIterator.prototype._waitForData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._pollFeeds();
                        return [4 /*yield*/, this._trigger.wait()];
                    case 1:
                        _a.sent();
                        this._trigger.reset();
                        return [2 /*return*/];
                }
            });
        });
    };
    FeedStoreIterator.prototype._generator = function () {
        return __asyncGenerator(this, arguments, function _generator_1() {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this._destroyed) return [3 /*break*/, 7];
                        _a.label = 1;
                    case 1:
                        if (!true) return [3 /*break*/, 5];
                        return [4 /*yield*/, __await(this._reevaluateFeeds())];
                    case 2:
                        _a.sent();
                        message = this._popSendQueue();
                        if (!message) {
                            return [3 /*break*/, 5];
                        }
                        this._messageCount++;
                        return [4 /*yield*/, __await(message)];
                    case 3: 
                    // TODO(burdon): Add feedKey (FeedMessage).
                    return [4 /*yield*/, _a.sent()];
                    case 4:
                        // TODO(burdon): Add feedKey (FeedMessage).
                        _a.sent();
                        return [3 /*break*/, 1];
                    case 5: return [4 /*yield*/, __await(this._waitForData())];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 0];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * This gets called by "for await" loop to get the iterator instance that's then polled on each loop iteration.
     * We return a singleton here to ensure that the `_generator` function only gets called once.
     */
    FeedStoreIterator.prototype[Symbol.asyncIterator] = function () {
        return this._generatorInstance;
    };
    FeedStoreIterator.prototype._trackDescriptor = function (descriptor) {
        this._candidateFeeds.add(descriptor);
        this._trigger.wake();
    };
    // TODO(marik-d): Does this need to close the streams, or will they be garbage-collected automatically?
    FeedStoreIterator.prototype.destory = function () {
        this._destroyed = true;
        this._trigger.wake();
    };
    return FeedStoreIterator;
}());
exports.FeedStoreIterator = FeedStoreIterator;
