//
// Copyright 2020 DXOS.org
//

import debug from 'debug';

import { createKeyPair } from '@dxos/crypto';

import { FeedKeyMapper, Spacetime } from './spacetime';

const log = debug('dxos:echo:clock');
debug.enable('dxos:echo:*');

describe('spacetime', () => {
  test('constructors', () => {
    const spacetime = new Spacetime(new FeedKeyMapper('feedKey'));

    const { publicKey: feedKey } = createKeyPair();

    const tf1 = spacetime.createTimeframe([[feedKey, 1]]);
    console.log(spacetime.stringify(tf1));
    expect(tf1).toBeTruthy();
  });

  test('merge/subtract', () => {
    const spacetime = new Spacetime(new FeedKeyMapper('feedKey'));

    const { publicKey: feedKey1 } = createKeyPair();
    const { publicKey: feedKey2 } = createKeyPair();
    const { publicKey: feedKey3 } = createKeyPair();

    {
      // Merge (no change).
      const tf1 = spacetime.createTimeframe([[feedKey1, 1], [feedKey2, 1]]);
      const tf2 = spacetime.createTimeframe([[feedKey1, 2], [feedKey3, 1]]);
      const tf3 = spacetime.merge(tf1, tf2);
      console.log(JSON.stringify(spacetime.toJson(tf3), undefined, 2));
      expect(spacetime.keyMapper.toArray(tf3)).toHaveLength(3);
    }

    {
      // Merge (no change).
      const tf1 = spacetime.createTimeframe([[feedKey1, 1]]);
      const tf2 = spacetime.createTimeframe([[feedKey1, 3]]);
      const tf3 = spacetime.createTimeframe([[feedKey1, 2]]);
      const tf4 = spacetime.merge(tf1, tf2, tf3);
      console.log(spacetime.stringify(tf4));
      expect(spacetime.keyMapper.toArray(tf4)).toHaveLength(1);
      expect(tf4.frames[0].seq).toBe(3);
    }

    {
      // Remove keys.
      const tf1 = spacetime.createTimeframe([[feedKey1, 1], [feedKey2, 2]]);
      const tf2 = spacetime.removeKeys(tf1, [feedKey1, feedKey3]);
      console.log(spacetime.stringify(tf2));
      expect(spacetime.keyMapper.toArray(tf2)).toHaveLength(1);
    }
  });

  test('compare', () => {
    const spacetime = new Spacetime(new FeedKeyMapper('feedKey'));

    const { publicKey: feedKey1 } = createKeyPair();
    const { publicKey: feedKey2 } = createKeyPair();
    const { publicKey: feedKey3 } = createKeyPair();

    {
      // Merge (no change).
      const tf1 = spacetime.createTimeframe([[feedKey1, 1]]);
      const tf2 = spacetime.createTimeframe([[feedKey1, 2]]);
      const result = spacetime.compare(tf1, tf2);
      expect(result).toBe(0);
    }
  });
});
