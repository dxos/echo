import { ObjectModel } from '@dxos/object-model';
import { Item, ItemFilter, ItemType } from '../items';
import { ResultSet } from '../result';
import { ModelFactory, ModelType } from '../../../model-factory/src';
import { Pipeline } from './pipeline';
import { PartyKey } from './types';
export declare const PARTY_ITEM_TYPE = "__PARTY_PROPERTIES__";
/**
 * Party.
 */
export declare class Party {
    private readonly _modelFactory;
    private readonly _pipeline;
    private _itemManager;
    private _itemDemuxer;
    /**
     * @param modelFactory
     * @param pipeline
     */
    constructor(modelFactory: ModelFactory, pipeline: Pipeline);
    toString(): string;
    get key(): PartyKey;
    get isOpen(): boolean;
    /**
     * Opens the pipeline.
     */
    open(): Promise<this>;
    /**
     * Closes the pipeline.
     */
    close(): Promise<this>;
    setProperty(key: string, value: any): Promise<Party>;
    getProperty(key: string): Promise<any>;
    createItem(itemType: ItemType, modelType: ModelType): Promise<Item<any>>;
    queryItems(filter?: ItemFilter): Promise<ResultSet<Item<any>>>;
    _getPropertiestItem(): Promise<Item<ObjectModel>>;
}
//# sourceMappingURL=party.d.ts.map