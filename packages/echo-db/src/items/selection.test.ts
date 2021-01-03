//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { Event } from '@dxos/async';
import { ItemID, ItemType } from '@dxos/echo-protocol';
import { ObjectModel } from '@dxos/object-model';

import { Item } from './item';
import { Link } from './link';
import { Selection } from './selection';

const createItem = (id: ItemID, type: ItemType) =>
  new Item(id, type, ObjectModel.meta, new ObjectModel(ObjectModel.meta, id));

// TODO(burdon): Create link mutation.
const createLink = (id: ItemID, type: ItemType, source: Item<any>, target: Item<any>) =>
  new Link(id, type, ObjectModel.meta, new ObjectModel(ObjectModel.meta, id), undefined, undefined, {
    sourceId: source.id,
    targetId: target.id,
    source: source,
    target: target
  });

// TODO(burdon): Implement generator used across tests and storybooks.
const objects: Item<any>[] = [
  createItem('item/0', 'wrn://dxos/type/test'),
  createItem('item/1', 'wrn://dxos/type/org'),
  createItem('item/2', 'wrn://dxos/type/org'),
  createItem('item/3', 'wrn://dxos/type/person'),
  createItem('item/4', 'wrn://dxos/type/person'),
  createItem('item/5', 'wrn://dxos/type/person')
];

const links: Item<any>[] = [
  createLink('link/1', 'wrn://dxos/link/employee', objects[1], objects[3]),
  createLink('link/2', 'wrn://dxos/link/employee', objects[1], objects[4]),
  createLink('link/3', 'wrn://dxos/link/employee', objects[1], objects[5]),
  createLink('link/4', 'wrn://dxos/link/employee', objects[2], objects[5])
];

const items: Item<any>[] = [
  ...objects,
  ...links
];

describe('Selection', () => {
  test('simple', () => {
    expect(new Selection(items, new Event()).items).toHaveLength(items.length);
  });

  test('filter', () => {
    expect(new Selection(items, new Event())
      .filter({ type: 'wrn://dxos/type/invalid' }).items).toHaveLength(0);

    expect(new Selection(items, new Event())
      .filter({ type: 'wrn://dxos/type/person' }).items).toHaveLength(3);

    expect(new Selection(items, new Event())
      .filter({ type: ['wrn://dxos/type/org', 'wrn://dxos/type/person'] }).items).toHaveLength(5);

    expect(new Selection(items, new Event())
      .filter((item: Item<any>) => item.type === 'wrn://dxos/type/org').items).toHaveLength(2);
  });

  test('nested with duplicates', () => {
    let count = 0;

    const selection = new Selection(items, new Event())
      .filter({ type: 'wrn://dxos/type/org' })
      .link({ type: 'wrn://dxos/link/employee' })
      .call(selection => {
        count = selection.items.length;
      })
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
      .filter({ type: 'wrn://dxos/type/org' })
      .each((org, selection) => {
        count.org++;
        selection
          .link({ type: 'wrn://dxos/link/employee' })
          .each(link => {
            assert(link.sourceId === org.id);
            count.links++;
          });
      });

    expect(count.org).toBe(2);
    expect(count.links).toBe(4);
  });
});
