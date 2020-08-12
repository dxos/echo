'use strict';
//
// Copyright 2020 DXOS.org
//
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt (value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected (value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
    function step (result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }; var f; var y; var t; var g;
  return g = { next: verb(0), throw: verb(1), return: verb(2) }, typeof Symbol === 'function' && (g[Symbol.iterator] = function () { return this; }), g;
  function verb (n) { return function (v) { return step([n, v]); }; }
  function step (op) {
    if (f) throw new TypeError('Generator is already executing.');
    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y.return : op[0] ? y.throw || ((t = y.return) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
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
    }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
Object.defineProperty(exports, '__esModule', { value: true });
var chance_1 = require('chance');
var debug_1 = require('debug');
var random_access_memory_1 = require('random-access-memory');
var tempy_1 = require('tempy');
var feed_store_1 = require('@dxos/feed-store');
var codec_protobuf_1 = require('@dxos/codec-protobuf');
var crypto_1 = require('@dxos/crypto');
var async_1 = require('@dxos/async');
var clock_1 = require('../clock');
var items_1 = require('./index');
var models_1 = require('../models');
var testing_1 = require('../testing');
var util_1 = require('../util');
var parties_1 = require('../parties');
var feed_1 = require('../pipeline/feed');
var testing_json_1 = require('../proto/gen/testing.json');
var log = debug_1.default('dxos:echo:testing');
debug_1.default.enable('dxos:echo:*');
var codec = new codec_protobuf_1.Codec('dxos.echo.testing.FeedEnvelope')
  .addJson(testing_json_1.default)
  .build();
var chance = new chance_1.default();
var ItemType = 'test-item';
/* eslint-disable no-lone-blocks */
describe('database', function () {
  test.skip('item construction', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var modelFactory, feedStore, feed, readable, itemManager, item, items;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            modelFactory = new models_1.ModelFactory()
              .registerModel(testing_1.TestModel.type, testing_1.TestModel);
            feedStore = new feed_store_1.FeedStore(random_access_memory_1.default, { feedOptions: { valueEncoding: codec } });
            return [4 /* yield */, feedStore.open()];
          case 1:
            _a.sent();
            return [4 /* yield */, feedStore.openFeed('test-feed')];
          case 2:
            feed = _a.sent();
            readable = feedStore.createReadStream({ live: true, feedStoreInfo: true });
            itemManager = new items_1.ItemManager(modelFactory, feed_1.createWritableFeedStream(feed));
            readable.pipe(items_1.createItemDemuxer(itemManager));
            return [4 /* yield */, itemManager.createItem(ItemType, testing_1.TestModel.type)];
          case 3:
            item = _a.sent();
            return [4 /* yield */, item.model.setProperty('title', 'Hello')];
          case 4:
            _a.sent();
            items = itemManager.getItems();
            expect(items).toHaveLength(1);
            items[0].model.on('update', function (model) {
              expect(model.value).toEqual({ title: 'Hello' });
            });
            return [2];
        }
      });
    });
  });
  test.skip('streaming', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var config, modelFactory, count, directory, feedStore, feed, readable, counter, itemManager, i, item, item, feedStore, descriptors, descriptor, feed, itemManager, created, updated, readable, items, _i, items_2, item;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            config = {
              numFeeds: 1,
              maxItems: 1,
              numMutations: 5
            };
            modelFactory = new models_1.ModelFactory().registerModel(testing_1.TestModel.type, testing_1.TestModel);
            count = {
              items: 0,
              mutations: 0
            };
            directory = tempy_1.default.directory();
            feedStore = new feed_store_1.FeedStore(directory, { feedOptions: { valueEncoding: codec } });
            return [4 /* yield */, feedStore.open()];
          case 1:
            _a.sent();
            return [4 /* yield */, feedStore.openFeed(ItemType)];
          case 2:
            feed = _a.sent();
            readable = feedStore.createReadStream({ live: true });
            counter = util_1.sink(feed, 'append', config.numMutations);
            itemManager = new items_1.ItemManager(modelFactory, feed_1.createWritableFeedStream(feed));
            readable.pipe(items_1.createItemDemuxer(itemManager));
            i = 0;
            _a.label = 3;
          case 3:
            if (!(i < config.numMutations)) return [3 /* break */, 8];
            if (!(count.items === 0 || (count.items < config.maxItems && Math.random() < 0.5))) return [3 /* break */, 5];
            return [4 /* yield */, itemManager.createItem(ItemType, testing_1.TestModel.type)];
          case 4:
            item = _a.sent();
            log('Created Item:', item.id);
            count.items++;
            return [3 /* break */, 7];
          case 5:
            item = chance.pickone(itemManager.getItems());
            log('Mutating Item:', item.id);
            return [4 /* yield */, item.model.setProperty(chance.pickone(['a', 'b', 'c']), 'value-' + i)];
          case 6:
            _a.sent();
            count.mutations++;
            _a.label = 7;
          case 7:
            i++;
            return [3 /* break */, 3];
          case 8: return [4 /* yield */, counter];
          case 9:
            _a.sent();
            return [4 /* yield */, feedStore.close()];
          case 10:
            _a.sent();
            log('Config:', config);
            log('Count:', count);
            feedStore = new feed_store_1.FeedStore(directory, { feedOptions: { valueEncoding: codec } });
            return [4 /* yield */, feedStore.open()];
          case 11:
            _a.sent();
            descriptors = feedStore.getDescriptors();
            expect(descriptors).toHaveLength(config.numFeeds);
            descriptor = chance.pickone(descriptors);
            return [4 /* yield */, descriptor.open()];
          case 12:
            feed = _a.sent();
            itemManager = new items_1.ItemManager(modelFactory, feed_1.createWritableFeedStream(feed));
            created = util_1.sink(itemManager, 'create', count.items);
            updated = util_1.sink(itemManager, 'update', count.mutations);
            readable = feedStore.createReadStream({ live: true });
            readable.pipe(items_1.createItemDemuxer(itemManager));
            // Wait for mutations to be processed.
            return [4 /* yield */, created];
          case 13:
          // Wait for mutations to be processed.
            _a.sent();
            return [4 /* yield */, updated];
          case 14:
            _a.sent();
            items = itemManager.getItems();
            for (_i = 0, items_2 = items; _i < items_2.length; _i++) {
              item = items_2[_i];
              log(item.model.value);
            }
            return [4 /* yield */, feedStore.close()];
          case 15:
            _a.sent();
            return [2];
        }
      });
    });
  });
  test.skip('timestamp writer', function () {
    var ownFeed = crypto_1.randomBytes();
    var feed1Key = crypto_1.randomBytes();
    var feed2Key = crypto_1.randomBytes();
    var _a = clock_1.createTimestampTransforms(ownFeed); var inboundTransfrom = _a[0]; var outboundTransfrom = _a[1];
    var writtenMessages = feed_1.collect(outboundTransfrom);
    // current timestamp = {}
    outboundTransfrom.write({ payload: { __type_url: 'dxos.echo.testing.ItemEnvelope' } });
    // current timestamp = { F1: 1 }
    inboundTransfrom.write(testing_1.createTestMessageWithTimestamp(feed1Key, new clock_1.LogicalClockStamp(), 1));
    // current timestamp = { F1: 1 }
    outboundTransfrom.write({ payload: { __type_url: 'dxos.echo.testing.ItemEnvelope' } });
    // current timestamp = { F1: 2 }
    inboundTransfrom.write(testing_1.createTestMessageWithTimestamp(feed1Key, new clock_1.LogicalClockStamp(), 2));
    // current timestamp = { F1: 2 }
    outboundTransfrom.write({ payload: { __type_url: 'dxos.echo.testing.ItemEnvelope' } });
    // current timestamp = { F1: 3, F2: 1 }
    inboundTransfrom.write(testing_1.createTestMessageWithTimestamp(feed1Key, new clock_1.LogicalClockStamp([[feed2Key, 1]]), 3));
    // current timestamp = { F1: 3, F2: 1 }
    outboundTransfrom.write({ payload: { __type_url: 'dxos.echo.testing.ItemEnvelope' } });
    // current timestamp = { F1: 3, F2: 1 }
    inboundTransfrom.write(testing_1.createTestMessageWithTimestamp(feed2Key, new clock_1.LogicalClockStamp(), 1));
    // current timestamp = { F1: 3, F2: 1 }
    outboundTransfrom.write({ payload: { __type_url: 'dxos.echo.testing.ItemEnvelope' } });
    // TODO(burdon): Is this testing anything other than the message generators (if not, then remove).
    expect(writtenMessages).toEqual([
      { payload: { __type_url: 'dxos.echo.testing.ItemEnvelope', timestamp: clock_1.LogicalClockStamp.encode(clock_1.LogicalClockStamp.zero()) } },
      { payload: { __type_url: 'dxos.echo.testing.ItemEnvelope', timestamp: clock_1.LogicalClockStamp.encode(new clock_1.LogicalClockStamp([[feed1Key, 1]])) } },
      { payload: { __type_url: 'dxos.echo.testing.ItemEnvelope', timestamp: clock_1.LogicalClockStamp.encode(new clock_1.LogicalClockStamp([[feed1Key, 2]])) } },
      { payload: { __type_url: 'dxos.echo.testing.ItemEnvelope', timestamp: clock_1.LogicalClockStamp.encode(new clock_1.LogicalClockStamp([[feed1Key, 3], [feed2Key, 1]])) } },
      { payload: { __type_url: 'dxos.echo.testing.ItemEnvelope', timestamp: clock_1.LogicalClockStamp.encode(new clock_1.LogicalClockStamp([[feed1Key, 3], [feed2Key, 1]])) } }
    ]);
  });
  test.skip('parties', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var modelFactory, feedStore, feeds, _a, descriptors, set, streams, itemIds, _b, inboundTransfrom, outboundTransform, itemManager, partyMuxer, itemDemuxer, items, items, items;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            modelFactory = new models_1.ModelFactory().registerModel(testing_1.TestModel.type, testing_1.TestModel);
            feedStore = new feed_store_1.FeedStore(random_access_memory_1.default, { feedOptions: { valueEncoding: codec } });
            return [4 /* yield */, feedStore.open()];
          case 1:
            _c.sent();
            return [4 /* yield */, feedStore.openFeed('feed-1')];
          case 2:
            _a = [
              _c.sent()
            ];
            return [4 /* yield */, feedStore.openFeed('feed-2')];
          case 3:
            _a = _a.concat([
              _c.sent()
            ]);
            return [4 /* yield */, feedStore.openFeed('feed-3')];
          case 4:
            feeds = _a.concat([
              _c.sent()
            ]);
            descriptors = [
              feedStore.getOpenFeed(function (descriptor) { return descriptor.path === 'feed-1'; }),
              feedStore.getOpenFeed(function (descriptor) { return descriptor.path === 'feed-2'; }),
              feedStore.getOpenFeed(function (descriptor) { return descriptor.path === 'feed-3'; })
            ];
            set = new Set();
            set.add(descriptors[0].feedKey);
            streams = [
              feed_1.createWritableFeedStream(feeds[0]),
              feed_1.createWritableFeedStream(feeds[1]),
              feed_1.createWritableFeedStream(feeds[2])
            ];
            itemIds = [
              crypto_1.createId()
            ];
            _b = clock_1.createTimestampTransforms(descriptors[0].key), inboundTransfrom = _b[0], outboundTransform = _b[1];
            itemManager = new items_1.ItemManager(modelFactory, outboundTransform.pipe(streams[0]));
            partyMuxer = parties_1.createPartyMuxer(feedStore, [descriptors[0].key]);
            itemDemuxer = items_1.createItemDemuxer(itemManager);
            partyMuxer.pipe(inboundTransfrom).pipe(itemDemuxer);
            streams[0].write(testing_1.createItemGenesis(itemIds[0], ItemType));
            streams[0].write(testing_1.createTestItemMutation(itemIds[0], 'title', 'Value-1'));
            streams[1].write(testing_1.createTestItemMutation(itemIds[0], 'title', 'Value-2')); // Hold.
            return [4 /* yield */, util_1.sink(itemManager, 'create', 1)];
          case 5:
            _c.sent();
            return [4 /* yield */, util_1.sink(itemManager, 'update', 1)];
          case 6:
            _c.sent();
            items = itemManager.getItems();
            expect(items).toHaveLength(1);
            expect(items[0].model.getValue('title')).toEqual('Value-1');
            streams[0].write(testing_1.createTestItemMutation(itemIds[0], 'title', 'Value-3'));
            return [4 /* yield */, util_1.sink(itemManager, 'update', 1)];
          case 7:
            _c.sent();
            items = itemManager.getItems();
            expect(items).toHaveLength(1);
            expect(items[0].model.getValue('title')).toEqual('Value-3');
            streams[0].write(testing_1.createPartyAdmit(descriptors[1].key));
            return [4 /* yield */, util_1.sink(itemManager, 'update', 1)];
          case 8:
            _c.sent();
            items = itemManager.getItems();
            expect(items).toHaveLength(1);
            expect(items[0].model.getValue('title')).toEqual('Value-2');
            return [2];
        }
      });
    });
  });
  test.skip('ordering', function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var modelFactory, feedStore, feeds, _a, descriptors, set, streams, itemIds, _b, inboundTransfrom, outboundTransform, itemManager, partyMuxer, itemDemuxer, timestamp, items, items;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            modelFactory = new models_1.ModelFactory().registerModel(testing_1.TestModel.type, testing_1.TestModel);
            feedStore = new feed_store_1.FeedStore(random_access_memory_1.default, { feedOptions: { valueEncoding: codec } });
            return [4 /* yield */, feedStore.open()];
          case 1:
            _c.sent();
            return [4 /* yield */, feedStore.openFeed('feed-1')];
          case 2:
            _a = [
              _c.sent()
            ];
            return [4 /* yield */, feedStore.openFeed('feed-2')];
          case 3:
            feeds = _a.concat([
              _c.sent()
            ]);
            descriptors = [
              feedStore.getOpenFeed(function (descriptor) { return descriptor.path === 'feed-1'; }),
              feedStore.getOpenFeed(function (descriptor) { return descriptor.path === 'feed-2'; })
            ];
            set = new Set();
            set.add(descriptors[0].feedKey);
            streams = [
              feed_1.createWritableFeedStream(feeds[0]),
              feed_1.createWritableFeedStream(feeds[1])
            ];
            itemIds = [
              crypto_1.createId(),
              crypto_1.createId()
            ];
            _b = clock_1.createTimestampTransforms(descriptors[0].key), inboundTransfrom = _b[0], outboundTransform = _b[1];
            itemManager = new items_1.ItemManager(modelFactory, outboundTransform.pipe(streams[0]));
            partyMuxer = parties_1.createPartyMuxer(feedStore, [descriptors[0].key, descriptors[1].key]);
            itemDemuxer = items_1.createItemDemuxer(itemManager);
            partyMuxer.pipe(inboundTransfrom).pipe(itemDemuxer);
            timestamp = new clock_1.LogicalClockStamp([[descriptors[1].key, 1]]);
            streams[0].write(testing_1.createItemGenesis(itemIds[0], ItemType, timestamp));
            streams[0].write(testing_1.createTestItemMutation(itemIds[0], 'title', 'Value-1', timestamp));
            return [4 /* yield */, async_1.sleep(10)];
          case 4:
            _c.sent(); // TODO(marik-d): Is threre a better way to do this?
            items = itemManager.getItems();
            expect(items).toHaveLength(0);
            streams[1].write(testing_1.createItemGenesis(itemIds[1], ItemType));
            streams[1].write(testing_1.createTestItemMutation(itemIds[1], 'title', 'Value-1'));
            return [4 /* yield */, util_1.sink(itemManager, 'create', 2)];
          case 5:
            _c.sent();
            return [4 /* yield */, util_1.sink(itemManager, 'update', 2)];
          case 6:
            _c.sent();
            items = itemManager.getItems();
            expect(items).toHaveLength(2);
            return [2];
        }
      });
    });
  });
});
