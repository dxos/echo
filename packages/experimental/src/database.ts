//
// Copyright 2020 DXOS.org
//

import { Event } from '@dxos/async';

import { ResultSet } from './result';
import { Party } from './parties';

/**
 * Root object for the ECHO databse.
 */
export class Database {
  private readonly _update = new Event();
  private _parties = new Map<Buffer, Party>();

  async createParty (): Promise<Party> {
    const party = new Party();
    this._parties.set(party.key, party);
    setImmediate(() => this._update.emit());
    return party;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async queryParties (filter?: any): Promise<ResultSet<Party>> {
    return new ResultSet<Party>(this._update, () => Array.from(this._parties.values()));
  }
}
