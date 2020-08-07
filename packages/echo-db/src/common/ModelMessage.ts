//
// Copyright 2020 DXOS.org
//

import { Any } from './Any';
import { dxos } from '../proto';
import ModelMessage = dxos.echo.ModelMessage;

export const createModelMessage = (data: any) => {
  return ModelMessage.create({
    data: Any.create(data)
  });
};
