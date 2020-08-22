import { Model } from '../../../model-factory/src';
import { ItemID, ItemType } from './types';
/**
 * Atomic data item.
 */
export declare class Item<M extends Model<any>> {
    private readonly _itemId;
    private readonly _itemType;
    private readonly _model;
    constructor(itemId: ItemID, itemType: ItemType, model: M);
    toString(): string;
    get id(): ItemID;
    get type(): ItemType;
    get model(): M;
}
//# sourceMappingURL=item.d.ts.map