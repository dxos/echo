//
// Copyright 2020 DXOS.org
//

import { createId, randomBytes } from '@dxos/crypto';
import { PartySnapshot } from '@dxos/echo-protocol';
import { createStorage, File } from '@dxos/random-access-multi-storage';

import { SnapshotStore } from './snapshot-store';

// RAM storage doesn't preserve data when re-opening files.
function createRamStorage () {
  const storage = createStorage('snapshots', 'ram');
  const files = new Map<string, File>();

  return (name: string) => {
    if (files.has(name)) {
      return files.get(name)!;
    }
    const file = storage(name);
    file.close = cb => cb?.(null); // fix
    files.set(name, file);
    return file;
  };
}

test('in-memory', async () => {
  const store = new SnapshotStore(createRamStorage() as any);

  const key1 = randomBytes();
  const key2 = randomBytes();

  expect(await store.load(key1)).toBeUndefined();
  expect(await store.load(key2)).toBeUndefined();

  const snapshot: PartySnapshot = {
    partyKey: key1,
    database: {
      items: [{
        itemId: createId(),
        itemType: 'foo'
      }]
    }
  };

  await store.save(snapshot);

  expect(await store.load(key1)).toEqual(snapshot);
  expect(await store.load(key2)).toBeUndefined();
});
