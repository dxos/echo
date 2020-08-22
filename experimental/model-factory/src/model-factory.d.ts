/// <reference types="node" />
import { ItemID } from '@dxos/experimental-echo-protocol';
import { Model } from './model';
import { ModelType, ModelConstructor } from './types';
/**
 * Creates Model instances from a registered collection of Model types.
 */
export declare class ModelFactory {
    private _models;
    hasModel(modelType: ModelType): boolean;
    registerModel(modelType: ModelType, modelConstructor: ModelConstructor<any>): ModelFactory;
    createModel<T extends Model<any>>(modelType: ModelType, itemId: ItemID, writable?: NodeJS.WritableStream): T;
}
//# sourceMappingURL=model-factory.d.ts.map