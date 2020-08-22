import { Event } from '@dxos/async';
import { FeedStore } from '@dxos/feed-store';
import { Options } from '../database';
import { ModelFactory } from '../../../model-factory/src';
import { Party } from './party';
import { PartyKey } from './types';
/**
 * Manages the life-cycle of parties.
 */
export declare class PartyManager {
    private readonly _parties;
    private readonly _feedStore;
    private readonly _modelFactory;
    private readonly _options;
    private readonly _onFeed;
    readonly update: Event<Party>;
    /**
     * @param feedStore
     * @param modelFactory
     * @param options
     */
    constructor(feedStore: FeedStore, modelFactory: ModelFactory, options?: Options);
    open(): Promise<void>;
    close(): Promise<void>;
    get parties(): Party[];
    /**
     * Creates a new party.
     */
    createParty(): Promise<Party>;
    /**
     * Gets existing party object or constructs a new one.
     *
     * @param partyKey
     */
    _getOrCreateParty(partyKey: PartyKey): Promise<Party>;
    /**
     * Constructs and registers a party object.
     *
     * @param partyKey
     */
    _constructParty(partyKey: PartyKey): Promise<Party>;
}
//# sourceMappingURL=party-manager.d.ts.map