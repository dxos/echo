//
// Copyright 2021 DXOS.org
//

//
// Airtable data structure
//

//
// Get all entities (i.e., display tabs and for each tab display fields as columns).
// const entities = echo
//   .select({ type: 'dxos/entity' })
//   .values;
//
// const links = echo
//   .select({ type: 'dxos/link' })
//   .values;
//
// echo
//   .select({ type: 'dxos/data', props: { entity: entities[0].id } })
//   .link({ type: 'app/link, props: { link: links[0].id })
//   .target();
//

//
// Currently ECHO has items which can be objects or links.
// Should entities be a first-order ECHO construct (i.e., like SQL schema not items)?
// OR a framework/layer on top of ECHO?
// I.e., special to Airtable pad, OR Teamwork, OR low-level ECHO?
//

//
// Hack to create array of values.
// {
//   type: 'dxos/entity',
//   properties: {
//     'field.0.name': 'Org',
//     'field.0.type': 'string'
//     'field.1.name': 'URL',
//     'field.1.type': 'string'
//   }
// }
//

export const items = [

  //
  // Entities
  //

  {
    id: 'entity-1',
    type: 'dxos/entity',
    props: {
      title: 'Org',
      fields: [
        {
          id: 'field-1',
          title: 'Name',
          type: 'string'
        },
        {
          id: 'field-2',
          title: 'URL',
          type: 'string'
        },
        {
          id: 'field-3',
          title: 'Employees',
          type: 'ref', // Back link
          meta: {
            link: 'link-1'
          }
        }
      ]
    }
  },
  {
    id: 'entity-2',
    type: 'dxos/entity',
    props: {
      title: 'Person',
      fields: [
        {
          id: 'field-1',
          title: 'Name',
          type: 'string'
        },
        {
          id: 'field-2',
          title: 'Employer',
          type: 'link', // Forward link
          meta: {
            link: 'link-1'
          }
        }
      ]
    }
  },

  //
  // Links
  //

  {
    id: 'link-1',
    type: 'dxos/link',
    props: {
      source: 'app/person', // Immutable
      target: 'app/org' // Immutable
    }
  },

  //
  // Data
  // ISSUE: is the type assigned (e.g., app/person) or the id of the corresponding dxos/entity.
  // ISSUE: IF assigned -- then when? (must be immutable.)
  //

  {
    id: 'org-1',
    type: 'entity-1', // ISSUE: Should the type be an ID?
    props: {
      fields: [
        {
          field: 'field-1',
          value: 'DXOS'
        },
        {
          field: 'field-2',
          value: 'https://dxos.org'
        }
      ]
    }
  },
  {
    id: 'org-2',
    type: 'entity-1',
    props: {
      fields: [
        {
          field: 'field-1',
          value: 'ETHWorks'
        }
      ]
    }
  },

  {
    id: 'person-1',
    type: 'entity-2',
    props: {
      fields: [
        {
          field: 'field-1',
          value: 'Rich'
        }
      ]
    }
  },
  {
    id: 'person-2',
    type: 'entity-2',
    props: {
      fields: [
        {
          field: 'field-1',
          value: 'Prezmek'
        }
      ]
    }
  },
  {
    id: 'person-3',
    type: 'entity-2',
    props: {
      fields: [
        {
          field: 'field-1',
          value: 'Dmytro'
        }
      ]
    }
  },

  {
    id: 'employer-1',
    link: true,
    type: 'link-1',
    source: 'person-1', // Rich
    target: 'org-1' // DXOS
  },
  {
    id: 'employer-2',
    link: true,
    type: 'link-1',
    source: 'person-2', // Przemek
    target: 'org-2' // ETHWorks
  }
];
