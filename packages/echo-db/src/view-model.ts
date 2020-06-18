import { createId } from '@dxos/crypto';
// TODO(burdon): Remove dependency (via adapter). Or move to other package.
import { Model } from '@dxos/model-factory';
import { raise } from './util';

// TODO(marik-d): Reuse existing ObjectModel mutation mechanisms and CRDTs
export interface ViewMutation {
  __type_url: string
  viewId: string
  [key: string]: any
}

export interface View {
  __type_url: string
  viewId: string
  title: string
}

export class ViewModel<T extends View = View> extends Model {
  private readonly _views = new Map<string, T>()

  getById(viewId: string): T | undefined {
    return this._views.get(viewId)
  }

  getAllViews(): T[] {
    return Array.from(this._views.values());
  }

  getAllForType(type: string): T[] {
    const res: T[] = [];
    for(const view of this._views.values()) {
      if(view.__type_url === type) {
        res.push(view);
      }
    }
    return res;
  }

  onUpdate (messages: ViewMutation[]) {
    console.log('apply', super.id, messages)
    for(const { viewId, __type_url, ...props } of messages) {
      const view = this.getById(viewId);
      if(view) {
        this._views.set(viewId, { ...view, ...props });
      } else {
        this._views.set(viewId, {
          viewId,
          __type_url,
          title: props.title ?? viewId,
           ...props,
        } as T);
      }
    }
  }

  createView(type: string, title: string, props: Partial<Omit<T, keyof View>> = {}): string {
    const viewId = createId();
    super.appendMessage({ title, ...props, viewId, __type_url: type });
    return viewId;
  }

  editView(viewId: string, props: Partial<Omit<T, 'viewId' | '__type_url'>>) {
    const view = this.getById(viewId) ?? raise(new Error(`View not found for id: ${viewId}`));
    super.appendMessage({ ...props, viewId, __type_url: view.__type_url });
  }
}