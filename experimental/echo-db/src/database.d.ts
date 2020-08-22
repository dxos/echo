/// <reference types="node" />
import { FeedStore } from '@dxos/feed-store';
import { ModelFactory } from '../../model-factory/src';
import { Party, PartyFilter, PartyKey } from './parties';
import { ResultSet } from './result';
export interface Options {
    readLogger?: NodeJS.ReadWriteStream;
    writeLogger?: NodeJS.ReadWriteStream;
}
/**
 * Root object for the ECHO databse.
 */
export declare class Database {
    private readonly _partyUpdate;
    private readonly _partyManager;
    /**
     * @param feedStore
     * @param modelFactory
     * @param options
     */
    constructor(feedStore: FeedStore, modelFactory: ModelFactory, options?: Options);
    open(): Promise<void>;
    close(): Promise<void>;
    /**
     * Creates a new party.
     */
    createParty(): Promise<Party>;
    /**
     * @param partyKey
     */
    getParty(partyKey: PartyKey): Promise<Party | undefined>;
    /**
     * @param filter
     */
    queryParties(filter?: PartyFilter): Promise<ResultSet<Party>>;
}
//# sourceMappingURL=database.d.ts.map