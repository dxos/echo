//
// Copyright 2020 DXOS.org
//

import { Trigger } from '@dxos/async';
import { FeedKey, FeedKeyMapper, Spacetime, Timeframe } from '@dxos/echo-protocol';

const spacetime = new Spacetime(new FeedKeyMapper('feedKey'));

export class TimeframeClock {
  private _timeframe = spacetime.createTimeframe();

  public readonly _syncTrigger = new Trigger();

  constructor (
    private readonly _syncTimeframe: Timeframe = spacetime.createTimeframe()
  ) {
    if (!this.hasGaps(this._syncTimeframe)) {
      this._syncTrigger.wake();
    }
  }

  get timeframe () {
    return this._timeframe;
  }

  updateTimeframe (key: FeedKey, seq: number) {
    this._timeframe = spacetime.merge(this._timeframe, spacetime.createTimeframe([[key, seq]]));

    if (!this.hasGaps(this._syncTimeframe)) {
      this._syncTrigger.wake();
    }
  }

  hasGaps (timeframe: Timeframe) {
    const gaps = spacetime.dependencies(timeframe, this._timeframe);
    return gaps.frames?.length !== 0;
  }

  async waitForSync () {
    await this._syncTrigger.wait();
  }
}
