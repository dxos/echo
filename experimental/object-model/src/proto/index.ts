//
// Copyright 2020 DXOS.org
//

import ObjectSchema from './gen/object.json';

export const Schema = ObjectSchema;

import { dxos as dxos1 } from './gen/object';

// This seems to be the only working way to re-export a namespace wrapping it in another namespace
export namespace protocol {
  export import dxos = dxos1;
}