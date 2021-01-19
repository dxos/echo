//
// Copyright 2020 DXOS.org
//

// TODO(burdon): Create index.
export const searchSelector = search => selection => {
  const match = (pattern, text) => {
    if (!pattern) {
      return true;
    }

    if (!text) {
      return false;
    }

    // TODO(burdon): Prefix match.
    return text.toLowerCase().indexOf(pattern) !== -1;
  };

  // TODO(burdon): Use selection to filter.
  return selection.items.filter(item => {
    // TODO(burdon): Filter types,
    if (item.type) {
      return false;
    }

    const text = item.model.getProperty('name'); // TODO(burdon): Generalize.
    return match(search, text);
  });
};
