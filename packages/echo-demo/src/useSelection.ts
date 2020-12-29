import { useEffect, useState } from 'react'
import { Selection } from "@dxos/echo-db";

export function useSelection<T>(selector: () => Selection<T>, deps: readonly any[]): T {
  const [initialSelection] = useState(() => selector());
  const [data, setData] = useState(initialSelection.data);
  useEffect(() => initialSelection.update.on(() => {
    setData(selector().data)
  }), deps)
  return data;
}
