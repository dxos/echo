//
// Copyright 2020 DXOS.org
//

export const OBJECT_ORG = 'wrn://dxos/object/org';
export const OBJECT_PERSON = 'wrn://dxos/object/person';
export const OBJECT_PROJECT = 'wrn://dxos/object/project';
export const OBJECT_TASK = 'wrn://dxos/object/task';

export const LINK_EMPLOYEE = 'wrn://dxos/link/employee';
export const LINK_PROJECT = 'wrn://dxos/link/project';
export const LINK_ASSIGNED = 'wrn://dxos/link/assigned';

// TODO(burdon): Query objects-only (i.e., not root party item).
export const itemSelector = selection => {
  return selection.items;
};

export const graphSelector = selection => {
  const nodes = [];
  const links = [];

  selection
    .filter({ type: OBJECT_ORG })
    .each(item => nodes.push({ id: item.id, type: OBJECT_ORG, title: item.model.getProperty('name') }))
    .call(selection => {
      selection.links({ type: LINK_PROJECT })
        .each(link => {
          nodes.push({ id: link.target.id, type: OBJECT_PROJECT, title: link.target.model.getProperty('name') });
          links.push({ id: link.id, source: link.source.id, target: link.target.id });
        })
        .target()
        .children()
        .each(item => {
          nodes.push({ id: item.id, type: OBJECT_TASK, title: item.model.getProperty('name') });
          links.push({ id: `${item.parent.id}-${item.id}`, source: item.parent.id, target: item.id });
        });
    })
    .links({ type: LINK_EMPLOYEE })
    .each(link => links.push({ id: link.id, source: link.source.id, target: link.target.id }))
    .target()
    .each(item => nodes.push({ id: item.id, type: OBJECT_PERSON, title: item.model.getProperty('name') }));

  return { nodes, links };
};
