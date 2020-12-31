//
// Copyright 2020 DXOS.org
//

export const OBJECT_ORG = 'wrn://dxos/object/org';
export const OBJECT_PERSON = 'wrn://dxos/object/person';
export const LINK_EMPLOYEE = 'wrn://dxos/link/employee';

// TODO(burdon): Query objects-only (i.e., not root party item).
// TODO(burdon): BUG: This doesn't get updated until the following mutation (UNLESS link count is displayed).
export const itemSelector = selection => {
  return selection.items;
};

export const graphSelector = selection => {
  const nodes = [];
  const links = [];

  selection
    .select({ type: OBJECT_ORG }) // TODO(burdon): Regexp, array of values to match.
    .each(item => nodes.push({
      id: item.id,
      type: OBJECT_ORG,
      title: item.model.getProperty('name')
    }))
    .select({ link: LINK_EMPLOYEE }) // TODO(burdon): Change to .link({ type: LINK_EMPLOYEE })?
    .each(link => links.push({
      id: link.id,
      source: link.source.id,
      target: link.target.id
    }))
    .target()
    .each(item => nodes.push({
      id: item.id,
      type: OBJECT_PERSON,
      title: item.model.getProperty('name')
    }));

  return { nodes, links };
};
