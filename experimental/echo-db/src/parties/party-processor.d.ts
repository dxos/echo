import { FeedKey, FeedSelector, MessageSelector } from '../feeds';
import { IHaloStream } from '../items';
import { PartyKey } from './types';
/**
 * Manages current party state (e.g., admitted feeds).
 */
export declare abstract class PartyProcessor {
    protected readonly _partyKey: PartyKey;
    protected readonly _feedKeys: Set<Uint8Array>;
    private _timeframe;
    /**
     * @param partyKey
     * @param feedKey - Genesis feed for node.
     */
    constructor(partyKey: PartyKey, feedKey: FeedKey);
    get partyKey(): Uint8Array;
    get feedKeys(): Uint8Array[];
    get timeframe(): import("../proto/gen/testing").dxos.echo.testing.ITimeframe;
    get feedSelector(): FeedSelector;
    get messageSelector(): MessageSelector;
    updateTimeframe(key: FeedKey, seq: number): void;
    processMessage(message: IHaloStream): Promise<void>;
    abstract _processMessage(message: IHaloStream): Promise<void>;
}
//# sourceMappingURL=party-processor.d.ts.map