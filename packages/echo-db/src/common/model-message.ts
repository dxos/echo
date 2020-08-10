//
// Copyright 2020 DXOS.org
//

import { dxos } from '../proto';
import { Any } from './any';

import GeneratedModelMessage = dxos.echo.ModelMessage;

export class ModelMessage extends GeneratedModelMessage {
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
