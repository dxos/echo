//
// Copyright 2020 DXOS.org
//

import { EventEmitter } from 'events';

import { ResultSet } from './result';
import { Party } from './parties';

/**
 * Root object for the ECHO databse.
 */
export class Database {
  _listeners = new EventEmitter();
  _parties = new Map<Buffer, Party>();

  async createParty (): Promise<Party> {
    const party = new Party();
    this._parties.set(party.key, party);
    setImmediate(() => this._listeners.emit('update:party', this));
    return party;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async queryParties (filter?: any): Promise<ResultSet<Party>> {
    return new ResultSet<Party>(this._listeners, 'party', () => Array.from(this._parties.values()));
  }
}
