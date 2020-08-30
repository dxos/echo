//
// Copyright 2020 DXOS.org
//


import ProtoSchema from './gen/dxos.json';
export const Schema = ProtoSchema;

// TODO(burdon): Doesn't work in storybook:
//   experimental_echo_protocol_1.dxos.dxos.echo.ItemChildMutation.Operation.REMOVE (has object's dxos.echo).
//   export * as protocol from './gen/dxos'; (doens't work in other modules: TS2503: Cannot find namespace 'protocol')
//   https://github.com/microsoft/TypeScript/issues/447 (2014!)
//   https://stackoverflow.com/questions/30357634/how-do-i-use-namespaces-with-typescript-external-modules
//   NOTE: Export is treated DIFFERENTLY by when importing external modules.
// import root from './gen/dxos';
// export { root as protocol };
// export * as protocol from './gen/dxos';
export { dxos } from './gen/dxos';
