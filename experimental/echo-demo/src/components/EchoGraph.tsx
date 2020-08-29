//
// Copyright 2020 DXOS.org
//

// @ts-ignore
import React, { useEffect, useRef, useState } from 'react';

import {
  Graph,
  ForceLayout,
  NodeProjector,
  LinkProjector,
// @ts-ignore
} from '@dxos/gem-spore';

/**
 * @param id
 * @param grid
 * @param dx
 * @constructor
 */
const EchoGraph = ({ id, grid, dx }: { id: string, grid: any, dx: number }) => {
  const [layout] = useState(new ForceLayout({
    center: (grid: any) => ({ x: grid.center.x + grid.scaleX(dx), y: grid.center.y })
  }));

  const [{ nodeProjector, linkProjector }] = useState({
    nodeProjector: new NodeProjector({ node: { radius: 16, showLabels: false } }),
    linkProjector: new LinkProjector({ nodeRadius: 16, showArrows: true })
  });

  // TODO(burdon): Create data on UX event.
  const data = {};
  useEffect(() => {
    setImmediate(async () => {
      // await database.open();
      // const parties = await database.queryParties();
      // console.log('########', id, parties.value);
    });
  }, []);

  return (
    <Graph
      grid={grid}
      data={data}
      layout={layout}
      nodeProjector={nodeProjector}
      linkProjector={linkProjector}
    />
  );
};

export default EchoGraph;
