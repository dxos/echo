import { Event } from '@dxos/async';
/**
 * Query results.
 */
export declare class ResultSet<T> {
    private readonly _resultsUpdate;
    private readonly _itemUpdate;
    private readonly _getter;
    private _value;
    private _handleUpdate;
    constructor(itemUpdate: Event<T>, getter: () => T[]);
    get value(): T[];
    /**
     * Subscribe for updates.
     * @param listener
     */
    subscribe(listener: (result: T[]) => void): () => void;
}
//# sourceMappingURL=result.d.ts.map