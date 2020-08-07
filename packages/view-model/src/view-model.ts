//
// Copyright 2020 DXOS.org
//

import { createId } from '@dxos/crypto';
import { createModelMessage, dxos } from '@dxos/echo-db';
// TODO(burdon): Remove dependency (via adapter). Or move to other package.
import { Model } from '@dxos/model-factory';

import { raise } from './util';
import IModelMessage = dxos.echo.model.IModelMessage;

// TODO(marik-d): Reuse existing ObjectModel mutation mechanisms and CRDTs
export interface ViewMutation {
  ['__type_url']: string
  viewId: string
  displayName?: string
  deleted?: boolean
  metadata?: Record<string, any>
}

export interface View<M extends {} = {}> {
  type: string
  viewId: string
  displayName: string
  deleted: boolean
  metadata: M
}

export class ViewModel<M extends {} = {}> extends Model {
  private readonly _views = new Map<string, View<M>>()

  getById (viewId: string): View<M> | undefined {
    return this._views.get(viewId);
  }

  getAllViews (): View<M>[] {
    return Array.from(this._views.values()).filter(view => !view.deleted);
  }

  getAllDeletedViews (): View<M>[] {
    return Array.from(this._views.values()).filter(view => view.deleted);
  }

  getAllForType (type: string): View<M>[] {
    const res: View<M>[] = [];
    for (const view of this._views.values()) {
      if (view.type === type && !view.deleted) {
        res.push(view);
      }
    }
    return res;
  }

  onUpdate (messages: IModelMessage[]) {
    for (const modelMessage of messages) {
      const message = <ViewMutation>modelMessage.data;
      const view = this.getById(message.viewId);
      if (view) {
        this._views.set(message.viewId, {
          ...view,
          displayName: message.displayName ?? view.displayName,
          deleted: message.deleted ?? view.deleted,
          metadata: {
            ...view.metadata,
            ...message.metadata
          }
        });
      } else {
        this._views.set(message.viewId, {
          type: message.__type_url,
          viewId: message.viewId,
          displayName: message.displayName ?? message.viewId,
          deleted: message.deleted ?? false,
          metadata: (message.metadata ?? {}) as M
        });
      }
    }
  }

  createView (type: string, displayName: string, metadata: M = {} as any): string {
    const viewId = createId();
    super.appendMessage(createModelMessage({ viewId, __type_url: type, displayName, metadata }));
    return viewId;
  }

  renameView (viewId: string, displayName: string) {
    const view = this.getById(viewId) ?? raise(new Error(`View not found for id: ${viewId}`));
    if (view.deleted) throw new Error(`Cannot rename deleted view with id: ${viewId}`);
    super.appendMessage(createModelMessage({ viewId, __type_url: view.type, displayName }));
  }

  updateView (viewId: string, metadata: Partial<M>) {
    const view = this.getById(viewId) ?? raise(new Error(`View not found for id: ${viewId}`));
    if (view.deleted) throw new Error(`Cannot update deleted view with id: ${viewId}`);
    super.appendMessage(createModelMessage({ viewId, __type_url: view.type, metadata }));
  }

  deleteView (viewId: string) {
    const view = this.getById(viewId) ?? raise(new Error(`View not found for id: ${viewId}`));
    if (view.deleted) return;
    super.appendMessage(createModelMessage({ viewId, __type_url: view.type, deleted: true }));
  }

  restoreView (viewId: string) {
    const view = this.getById(viewId) ?? raise(new Error(`View not found for id: ${viewId}`));
    if (!view.deleted) return;
    super.appendMessage(createModelMessage({ viewId, __type_url: view.type, deleted: false }));
  }
}
