//
// Copyright 2020 DXOS.org
//

export * from './components';
export * from './hooks';

import { protocol } from '@dxos/experimental-echo-protocol'
import { protocol as objectModelProtcol } from '@dxos/experimental-object-model';

// TODO (marik-d): Only here to demo that namespaces work
console.log(protocol.dxos.echo.ItemChildMutation.Operation)
console.log(objectModelProtcol.dxos.echo.object.ObjectMutation.Operation)