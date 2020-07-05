//
// Copyright 2020 DxOS.org
//

import debug from 'debug';

import { BaseModel } from './echo-model';
import { MutationUtil } from './mutation';
import { LastWriterObjectStore, fromObject } from './last-writer-object-store';
import { SerializationSink } from './snapshot';
import { StorageProvider } from './storage';
import { createObjectId, parseObjectId } from './util';
import { EchoMessage } from './echo-feeds';
import { EchoModelFilter, EchoModelQueryResults } from './query';

const log = debug('dxos:echo:model');

type ItemId = string;
type ItemType = string;

// TODO(dboreham): Should model's data interface include consistency (return Anchors)?

export class LastWriterObjectModel extends BaseModel {
    private objectStore = new LastWriterObjectStore();

    getItem (id: ItemId) {
      log('get', id);

      return this.objectStore.getObjectById(id);
    }

    // TODO(dboreham): Rename -> getItemsByType
    getObjectsByType (type: ItemType) {
      return this.objectStore.getObjectsByType(type);
    }

    async createItem (type: ItemType, properties: object): Promise<ItemId> {
      log('create', type, properties);

      const id = createObjectId(type);
      const mutations = fromObject({ id, properties });

      await this.appendMessage({
        __type_url: type,
        ...mutations
      });

      return id;
    }

    async updateItem (id: ItemId, properties: object): Promise<void> {
      log('update', id, properties);

      const { type } = parseObjectId(id);
      const mutations = fromObject({
        id,
        properties
      });

      await this.appendMessage({
        __type_url: type,
        ...mutations
      });
    }

    async deleteItem (id: ItemId): Promise<void> {
      log('delete', id);

      const { type } = parseObjectId(id);
      const mutation = MutationUtil.createMessage(id, { deleted: true });

      await this.appendMessage({
        __type_url: type,
        ...mutation
      });
    }

    protected async applyMutations (messages: EchoMessage[]): Promise<void> {
      this.objectStore.applyMutations(messages);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async registerStorageProvider (provider: StorageProvider): Promise<void> {
      throw new Error('NYI');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async serialize (sink: SerializationSink): Promise<void> {
      throw new Error('NYI');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    query (filter: EchoModelFilter): EchoModelQueryResults {
      throw new Error('Method not implemented.');
    }
}
