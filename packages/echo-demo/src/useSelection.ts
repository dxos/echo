import { useEffect, useState } from 'react'
import { Selection } from "@dxos/echo-db";

export function useSelection<T>(selector: () => Selection<T>, deps: readonly any[]): T {
  const [firstSelection] = useState(() => selector());
  const [data, setData] = useState(firstSelection.data);
  useEffect(() => firstSelection.update.on(() => {
    setData(selector().data)
  }), deps)
  return data;
}
