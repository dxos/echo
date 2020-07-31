//
// Copyright 2020 DXOS.org
//

import { ModelData } from './ModelMessage';

export interface OrderedModelData extends ModelData {
  messageId: number,
  previousMessageId: number
}
