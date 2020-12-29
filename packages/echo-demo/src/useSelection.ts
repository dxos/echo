import { useEffect, useState } from 'react'
import { Item, Selection } from "@dxos/echo-db";

export function useSelection<T>(select: () => Selection<T>, deps: readonly any[]): T {
  const [firstSelection] = useState(() => select());
  const [data, setData] = useState(firstSelection.data);
  useEffect(() => firstSelection.update.on(() => {
    setData(select().data)
  }), deps)
  return data;
}
