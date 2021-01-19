//
// Copyright 2020 DXOS.org
//

export const OBJECT_ORG = 'dxn://example/object/org';
export const OBJECT_PERSON = 'dxn://example/object/person';
export const OBJECT_PROJECT = 'dxn://example/object/project';
export const OBJECT_TASK = 'dxn://example/object/task';

export const LINK_EMPLOYEE = 'dxn://example/link/employee';
export const LINK_PROJECT = 'dxn://example/link/project';
export const LINK_ASSIGNED = 'dxn://example/link/assigned';

export const itemSelector = selection => {
  return selection.items;
};

export const graphSelector = adapter => selection => {
  const nodes = [];
  const links = [];

  selection
    .filter({ type: OBJECT_ORG })
    .each(item => nodes.push({ id: item.id, type: OBJECT_ORG, title: adapter.primary(item) }))
    .call(selection => {
      selection.links({ type: LINK_PROJECT })
        .each(link => {
          nodes.push({ id: link.target.id, type: OBJECT_PROJECT, title: adapter.primary(link.target) });
          links.push({ id: link.id, source: link.source.id, target: link.target.id });
        })
        .target()
        .children()
        .each(item => {
          nodes.push({ id: item.id, type: OBJECT_TASK, title: adapter.primary(item) });
          links.push({ id: `${item.parent.id}-${item.id}`, source: item.parent.id, target: item.id });
        });
    })
    .links({ type: LINK_EMPLOYEE })
    .each(link => links.push({ id: link.id, source: link.source.id, target: link.target.id }))
    .target()
    .each(item => nodes.push({ id: item.id, type: OBJECT_PERSON, title: adapter.primary(item) }));

  return { nodes, links };
};
