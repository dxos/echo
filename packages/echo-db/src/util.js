//
// Copyright 2020 DxOS.org
//

import assert from 'assert';

import { createId } from '@dxos/crypto';

/**
 * Crate typed object identifier.
 * @param {string} type
 * @param {string} [id]
 * @return {string} ID
 */
// TODO(burdon): Make url safe?
export const createObjectId = (type, id = undefined) => {
  assert(type, 'Required type');

  return `${type}/${id || createId()}`;
};

/**
 * Parse ID string.
 * @param {string} id
 * @return {{id: string, type: string}}
 */
export const parseId = (id) => {
  const parts = id.split('/');
  assert(parts.length === 2 ? parts[0] : parts[1]);

  return { type: parts[0], id: parts[1] };
};

/**
 * Sorting function for Array.sort.
 * @param {string} property
 */
export const sortByProperty = property => ({ [property]: a }, { [property]: b }) => (a > b ? 1 : a < b ? -1 : 0);
