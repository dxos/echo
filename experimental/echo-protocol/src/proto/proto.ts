//
// Copyright 2020 DXOS.org
//


import ProtoSchema from './gen/dxos.json';
export const Schema = ProtoSchema;

import { dxos as dxos1 } from './gen/dxos';

// This seems to be the only working way to re-export a namespace wrapping it in another namespace
export namespace protocol {
  export import dxos = dxos1
}