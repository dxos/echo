import { FeedMeta } from '@dxos/experimental-echo-protocol';
import { dxos } from '../proto/gen/testing';
import { Model } from '../model';
import { ModelType } from '../types';
/**
 * Test model.
 */
export declare class TestModel extends Model<dxos.echo.testing.ITestItemMutation> {
    static type: ModelType;
    private _values;
    get keys(): any[];
    get properties(): any;
    getProperty(key: string): any;
    setProperty(key: string, value: string): Promise<void>;
    appendProperty(key: string, value: string): Promise<void>;
    _processMessage(meta: FeedMeta, message: dxos.echo.testing.ITestItemMutation): Promise<boolean>;
}
//# sourceMappingURL=test-model.d.ts.map