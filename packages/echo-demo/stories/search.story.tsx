//
// Copyright 2020 DXOS.org
//

import React, {useEffect, useState} from 'react';

import { ItemList, SearchBar, useSelection } from "../src";

// TODO(burdon): Merge.
import { useDatabase } from './testing';

export default {
  title: 'Search'
};

// TODO(burdon): Create index.
export const searchSelector = search => selection => {
  const items = [];

  const match = (pattern, text) => {
    if (!pattern || !text) {
      return false;
    }

    return text.toLowerCase().indexOf(pattern) !== -1;
  };

  selection.each(item => {
    const text = item.model.getProperty('name'); // TODO(burdon): Generalize.
    if (match(search, text)) {
      items.push(item);
    }
  });

  return items;
};

export const withSearch = () => {
  const database = useDatabase();
  const [search, setSearch] = useState(undefined);
  const items = useSelection(database && database.select(), searchSelector(search), [search]);

  const handleUpdate = text => setSearch(text.toLowerCase());

  return (
    <div>
      <SearchBar onUpdate={handleUpdate} />
      <ItemList items={items} />
    </div>
  );
};
