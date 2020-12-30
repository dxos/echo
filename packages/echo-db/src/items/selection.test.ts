//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { Event } from '@dxos/async';
import { ItemID } from '@dxos/echo-protocol';
import { ObjectModel } from '@dxos/object-model';

import { Item } from './item';
import { Link } from './link';
import { Selection } from './selection';

// TODO(burdon): ItemType?
const createItem = (id: ItemID, type: string) =>
  new Item(id, type, ObjectModel.meta, new ObjectModel(ObjectModel.meta, id));

// TODO(burdon): Create link mutation.
const createLink = (id: ItemID, type: string, source: Item<any>, target: Item<any>) =>
  new Link(id, type, ObjectModel.meta, new ObjectModel(ObjectModel.meta, id), undefined, undefined, {
    sourceId: source.id,
    targetId: target.id,
    source: source,
    target: target
  });

// TODO(burdon): Implement generator for testing.
const items: Item<any>[] = [
  createItem('item/0', 'wrn://dxos/type/test'),
  createItem('item/1', 'wrn://dxos/type/org'),
  createItem('item/2', 'wrn://dxos/type/org'),
  createItem('item/3', 'wrn://dxos/type/person'),
  createItem('item/4', 'wrn://dxos/type/person'),
  createItem('item/5', 'wrn://dxos/type/person')
];

items.push(createLink('link/1', 'wrn://dxos/link/employee', items[1], items[3]));
items.push(createLink('link/2', 'wrn://dxos/link/employee', items[1], items[4]));
items.push(createLink('link/3', 'wrn://dxos/link/employee', items[1], items[5]));
items.push(createLink('link/4', 'wrn://dxos/link/employee', items[2], items[5]));

describe('Selection', () => {
  test('simple', () => {
    expect(new Selection(items, new Event()).items).toHaveLength(items.length);

    // expect(new Selection(items, {})
    // .select().items).toHaveLength(items.length);

    expect(new Selection(items, new Event())
      .select({ type: 'wrn://dxos/type/person' }).items).toHaveLength(3);

    expect(new Selection(items, new Event())
      .select({ type: 'wrn://dxos/type/invalid' }).items).toHaveLength(0);
  });

  test('nested with duplicates', () => {
    let count = 0;

    const selection = new Selection(items, new Event())
      .select({ type: 'wrn://dxos/type/org' })
      .select({ link: 'wrn://dxos/link/employee' })
      .each(() => count++)
      .target();

    expect(count).toBe(4);
    expect(selection.items).toHaveLength(3);
  });

  test('calling', () => {
    const count = {
      org: 0,
      links: 0
    };

    new Selection(items, new Event())
      .select({ type: 'wrn://dxos/type/org' })
      .each((org, selection) => {
        count.org++;
        selection
          .select({ link: 'wrn://dxos/link/employee' })
          .each((link) => {
            assert(link.sourceId === org.id);
            count.links++;
          });
      });

    expect(count.org).toBe(2);
    expect(count.links).toBe(4);
  });
});
