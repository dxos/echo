//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { Event } from '@dxos/async';

import { ResultSet } from './result';
import { Party } from './parties';
import { ModelFactory } from './models';

// TODO(burdon): Ensure streams are closed when objects are destroyed (on purpose or on error).
// TODO(burdon): Ensure event handlers are removed.

/**
 * Root object for the ECHO databse.
 */
export class Database {
  private readonly _update = new Event();
  private readonly _modelFactory: ModelFactory;
  private readonly _parties = new Map<Buffer, Party>();

  constructor ({ modelFactory }: { modelFactory: ModelFactory }) {
    assert(modelFactory);
    this._modelFactory = modelFactory;
  }

  async createParty (): Promise<Party> {
    const party = new Party(this._modelFactory);
    this._parties.set(party.key, party);
    setImmediate(() => this._update.emit());
    return party;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async queryParties (filter?: any): Promise<ResultSet<Party>> {
    return new ResultSet<Party>(this._update, () => Array.from(this._parties.values()));
  }
}
