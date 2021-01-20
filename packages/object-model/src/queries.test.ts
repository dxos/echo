//
// Copyright 2020 DXOS.org
//

import { Predicate, Query } from './proto';
import { QueryProcessor } from './queries';

test('Basic queries', () => {
  const queries: Query[] = [
    {
      root: {
        op: Predicate.Operation.EQUALS,
        key: 'name',
        value: {
          string: 'xxx'
        }
      }
    },
    {
      root: {
        op: Predicate.Operation.EQUALS,
        key: 'name',
        value: {
          string: 'item-0'
        }
      }
    },
    {
      root: {
        op: Predicate.Operation.NOT,
        predicates: [
          {
            op: Predicate.Operation.EQUALS,
            key: 'name',
            value: {
              string: 'item-1'
            }
          }
        ]
      }
    },
    {
      root: {
        op: Predicate.Operation.OR,
        predicates: [
          {
            op: Predicate.Operation.EQUALS,
            key: 'name',
            value: {
              string: 'item-0'
            }
          },
          {
            op: Predicate.Operation.EQUALS,
            key: 'name',
            value: {
              string: 'item-2'
            }
          }
        ]
      }
    },
    {
      root: {
        op: Predicate.Operation.IN,
        key: 'label',
        value: {
          array: {
            values: [
              {
                string: 'red'
              },
              {
                string: 'green'
              },
              {
                string: 'blue'
              }
            ]
          }
        }
      }
    },
    {
      root: {
        op: Predicate.Operation.OR,
        predicates: [
          {
            op: Predicate.Operation.EQUALS,
            key: 'name',
            value: {
              string: 'item-0'
            }
          },
          {
            op: Predicate.Operation.IN,
            key: 'label',
            value: {
              array: {
                values: [
                  {
                    string: 'red'
                  },
                  {
                    string: 'green'
                  },
                  {
                    string: 'blue'
                  }
                ]
              }
            }
          }
        ]
      }
    },
    {
      root: {
        op: Predicate.Operation.PREFIX_MATCH,
        key: 'name',
        value: {
          string: 'item'
        }
      }
    },
    {
      root: {
        op: Predicate.Operation.TEXT_MATCH,
        key: 'description',
        value: {
          string: 'dx'
        }
      }
    },
    {
      root: {
        op: Predicate.Operation.TEXT_MATCH,
        key: 'description',
        value: {
          string: ''
        }
      }
    }
  ];

  const items = [
    {
      name: 'item-0',
      description: 'this should not match any text queries.'
    },
    {
      name: 'item-1',
      label: 'red',
      description: 'this item -- references  dxos  projects.'
    },
    {
      name: 'item-2',
      label: 'green'
    }
  ];

  const getter = (item: any, key: string) => item[key];

  const results = queries.map(query => {
    const processor = new QueryProcessor(query, getter);
    return items.filter(item => processor.match(item));
  });

  expect(results).toEqual([
    [],
    [items[0]],
    [items[0], items[2]],
    [items[0], items[2]],
    [items[1], items[2]],
    [items[0], items[1], items[2]],
    [items[0], items[1], items[2]],
    [items[1]],
    []
  ]);
});
