//
// Copyright 2020 DXOS.org
//

import { Indexer } from './indexer';

test('index', () => {
  const items = [
    {
      id: 'item-0',
      title: ''
    },
    {
      id: 'item-1',
      title: 'Hamlet',
      description: 'The Tragedy of Hamlet, Prince of Denmark, often shortened to Hamlet,' +
        ' is a tragedy written by William Shakespeare sometime between 1599 and 1601.',
      url: 'https://en.wikipedia.org/wiki/Hamlet'
    },
    {
      id: 'item-2',
      title: 'Macbeth',
      description: 'Macbeth, fully The Tragedy of Macbeth, is a tragedy by William Shakespeare.',
      url: 'https://en.wikipedia.org/wiki/Macbeth'
    },
    {
      id: 'item-3',
      title: 'The Tempest',
      description: 'The Tempest is a play by English playwright William Shakespeare, probably written in 1610–1611, ' +
        'and thought to be one of the last plays that Shakespeare wrote alone.',
      url: 'https://en.wikipedia.org/wiki/The_Tempest'
    }
  ];

  const getter = (item: any, key: string) => item[key];
  const indexer = new Indexer({ fields: ['title', 'description'], getter });

  {
    indexer.update(items);
    const results = indexer.match('william');
    expect(results).toHaveLength(3);
  }

  {
    indexer.update(items.slice(0, 3));
    const results = indexer.match('william');
    expect(results).toHaveLength(2);
  }

  // TODO(burdon): Create QueryProcessor to join text search with matcher.
});
