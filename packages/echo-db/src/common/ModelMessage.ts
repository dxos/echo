//
// Copyright 2020 DXOS.org
//

import { Any } from './Any';
import { dxos } from '../proto';
import MM = dxos.echo.ModelMessage;

export class ModelMessage extends MM {
  // Provide a simple toJSON, since the auto-generated version does not handle 'Any' members properly.
  public toJSON (): { [p: string]: any } {
    return { ...this };
  }
}

export const createModelMessage = (data: any) => {
  return new ModelMessage({
    data: Any.create(data)
  });
};
