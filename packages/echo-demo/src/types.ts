//
// Copyright 2020 DXOS.org
//

export const OBJECT_ORG = 'dxn:echo.dxos:object/org';
export const OBJECT_PERSON = 'dxn:echo.dxos:object/person';
export const LINK_EMPLOYEE = 'dxn:echo.dxos:link/employee';

export const graphSelector = selection => {
  const nodes = [];
  const links = [];

  selection
    .select({ type: OBJECT_ORG })
    .each(item => nodes.push({
      id: item.id,
      type: 'org', // TODO(burdon): OBJECT_ORG
      title: item.model.getProperty('name')
    }))
    .select({ link: LINK_EMPLOYEE })
    .each(link => links.push({
      id: link.id,
      source: link.source.id,
      target: link.target.id
    }))
    .target()
    .each(item => nodes.push({
      id: item.id,
      type: 'person', // TODO(burdon): OBJECT_PERSON
      title: item.model.getProperty('name')
    }));

  return { nodes, links };
};
