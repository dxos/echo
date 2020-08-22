/**
 * A simple syntax sugar to write `value as T` as a statement.
 *
 * NOTE: This does not provide any type safety.
 * It's just for convinience so that autocomplete works for value.
 * It's recomended to check the type URL mannuly beforehand or use `assertAnyType` instead.
 * @param value
 */
export declare function assumeType<T>(value: unknown): asserts value is T;
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
export declare function assertAnyType<T>(value: unknown, typeUrl: string): asserts value is T;
export declare function assertTypeUrl(value: any, typeUrl: string): void;
//# sourceMappingURL=assert.d.ts.map