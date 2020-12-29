//
// Copyright 2020 DXOS.org
//

import { useEffect, useState } from 'react';

import { Selection } from '@dxos/echo-db';

export function useSelection<T> (selection: Selection<any>, selector: (selection: Selection<any>) => T, deps: readonly any[]): T {
  const [data, setData] = useState(() => selector(selection));

  const [event] = useState(selection.update);
  useEffect(() => event.on(() => {
    setData(selector(selection));
  }), []);

  useEffect(() => {
    setData(selector(selection));
  }, deps);

  return data;
}
