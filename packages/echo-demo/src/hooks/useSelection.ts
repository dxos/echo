//
// Copyright 2020 DXOS.org
//

import { useEffect, useState } from 'react';

import { Selection } from '@dxos/echo-db';

/**
 * Hook to generate values from a selection.
 * @param selection Source selection.
 * @param selector Callback to generate data.
 * @param deps Array of values that the selector depends on.
 */
// TODO(burdon): Factor out.
export function useSelection<T> (
  selection: Selection<any>,
  selector: (selection: Selection<any>) => T,
  deps: readonly any[]
): T {
  const [data, setData] = useState(() => selector(selection));

  // Subscribe to mutation events from source.
  const [event] = useState(selection.update);
  useEffect(() => event.on(() => {
    setData(selector(selection));
  }), []);

  // Update data when deps change.
  useEffect(() => {
    setData(selector(selection));
  }, deps);

  return data;
}
