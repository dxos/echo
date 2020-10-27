//
// Copyright 2020 DXOS.org
//

import { FeedKey, spacetime, Timeframe } from '@dxos/echo-protocol';

export class TimeframeClock {
  constructor(
    private _timeframe = spacetime.createTimeframe(),
  ) {}

  get timeframe () {
    return this._timeframe;
  }

  updateTimeframe (key: FeedKey, seq: number) {
    this._timeframe = spacetime.merge(this._timeframe, spacetime.createTimeframe([[key as any, seq]]));
  }

  hasGaps (timeframe: Timeframe) {
    const gaps = spacetime.dependencies(timeframe, this._timeframe);
    return gaps.frames && gaps.frames.length !== 0;
  }
}
