//
// Copyright 2020 DXOS.org
//

import { Event } from '@dxos/async';
import { FeedKey, spacetime, Timeframe } from '@dxos/echo-protocol';

export class TimeframeClock {
  readonly update = new Event<Timeframe>();

  constructor (
    private _timeframe = spacetime.createTimeframe()
  ) {}

  get timeframe () {
    return this._timeframe;
  }

  updateTimeframe (key: FeedKey, seq: number) {
    this._timeframe = spacetime.merge(this._timeframe, spacetime.createTimeframe([[key as any, seq]]));
    this.update.emit(this._timeframe);
  }

  hasGaps (timeframe: Timeframe) {
    const gaps = spacetime.dependencies(timeframe, this._timeframe);
    return gaps.frames && gaps.frames.length !== 0;
  }
}
