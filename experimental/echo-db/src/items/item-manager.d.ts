/// <reference types="node" />
import { ModelType, ModelFactory, Model } from '../../../model-factory/src';
import { Item } from './item';
import { ItemID, ItemType } from './types';
import { ResultSet } from '../result';
export interface ItemFilter {
    type: ItemType;
}
/**
 * Manages the creation and indexing of items.
 */
export declare class ItemManager {
    private readonly _itemUpdate;
    private _items;
    private _pendingItems;
    _modelFactory: ModelFactory;
    _writeStream?: NodeJS.WritableStream;
    /**
     * @param modelFactory
     * @param writeStream Outbound `dxos.echo.testing.IEchoEnvelope` mutation stream.
     */
    constructor(modelFactory: ModelFactory, writeStream?: NodeJS.WritableStream);
    /**
     * Creates an item and writes the genesis message.
     * @param itemType item type
     * @param modelType model type
     */
    createItem(itemType: ItemType, modelType: ModelType): Promise<Item<any>>;
    /**
     * Constructs an item with the appropriate model.
     * @param itemId
     * @param itemType
     * @param modelType
     * @param readable Inbound mutation stream.
     */
    constructItem(itemId: ItemID, itemType: ItemType, modelType: ModelType, readable: NodeJS.ReadableStream): Promise<Item<Model<any>>>;
    /**
     * Retrieves a item from the index.
     * @param itemId
     */
    getItem(itemId: ItemID): Item<any> | undefined;
    /**
     * Return matching items.
     * @param [filter]
     */
    queryItems(filter?: ItemFilter): Promise<ResultSet<Item<any>>>;
}
//# sourceMappingURL=item-manager.d.ts.map