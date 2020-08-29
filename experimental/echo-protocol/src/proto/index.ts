//
// Copyright 2020 DXOS.org
//

import ProtoSchema from './gen/dxos.json';

export const Schema = ProtoSchema;

export { dxos as protocol_dxos } from './gen/dxos';

export * from './codec';
export * from './messages';
