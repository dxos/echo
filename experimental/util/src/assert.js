"use strict";
//
// Copyright 2020 DXOS.org
//
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertTypeUrl = exports.assertAnyType = exports.assumeType = void 0;
const assert_1 = __importDefault(require("assert"));
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
/**
 * Checks the type of messages that come from `google.protobuf.Any` encoding.
 *
 * ## Usage example:
 * ```
 * assertAnyType<dxos.echo.IItemEnvelope>(message, 'dxos.echo.ItemEnvelope');
 * ```
 * @param value
 * @param typeUrl
 */
// TODO(burdon): Move to codec.
function assertAnyType(value, typeUrl) {
    assertTypeUrl(value, typeUrl);
}
exports.assertAnyType = assertAnyType;
// TODO(burdon): Move to codec.
function assertTypeUrl(value, typeUrl) {
    assert_1.default(value.__type_url === typeUrl, `Expected message with type URL \`${typeUrl}\` instead got \`${value.__type_url}\``);
}
exports.assertTypeUrl = assertTypeUrl;
//# sourceMappingURL=assert.js.map