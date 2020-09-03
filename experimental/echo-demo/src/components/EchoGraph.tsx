//
// Copyright 2020 DXOS.org
//

// @ts-ignore
import React, { useEffect, useRef, useState } from 'react';

import {
  convertTreeToGraph,
  createTree,
  useObjectMutator,
// @ts-ignore
} from '@dxos/gem-core';

import {
  createSimulationDrag,
  useGraphStyles,
  Graph,
  ForceLayout,
  LinkProjector,
  NodeProjector,
// @ts-ignore
} from '@dxos/gem-spore';

/**
 * @param id
 * @param grid
 * @param dx
 * @constructor
 */
const EchoGraph = ({ id, grid, dx }: { id: string, grid: any, dx: number }) => {
  const guides = useRef();
  const classes = useGraphStyles();

  const [{ nodeProjector, linkProjector }] = useState({
    nodeProjector: new NodeProjector({ node: { radius: 16, showLabels: false } }),
    linkProjector: new LinkProjector({ nodeRadius: 16, showArrows: true })
  });

  const [layout] = useState(new ForceLayout({
    center: (grid: any) => ({ x: grid.center.x + grid.scaleX(dx), y: grid.center.y })
  }));

  const [selected, setSelected] = useState();
  const [drag] = useState(() => createSimulationDrag(layout.simulation, { link: 'metaKey' }));
  useEffect(() => {
    drag.on('click', ({ source: { id }}) => {
      setSelected(id);
    });

    drag.on('drag', ({ source, position, linking }) => {
      if (!linking) {
        return;
      }

      const data = {
        links: [
          { id: 'guide-link', source, target: { id: 'guide-link-target', ...position } },
        ]
      };

      linkProjector.update(grid, data, { group: guides.current });
    });

    drag.on('end', ({ source, target, linking }) => {
      if (!linking) {
        return;
      }

      linkProjector.update(grid, {}, { group: guides.current });
    });
  }, [drag]);

  // TODO(burdon): Create data on UX event (and protocol updates).
  const [data, setData, getData, updateData] = useObjectMutator(convertTreeToGraph(createTree(4)));
  // const [data] = useState({
  //   nodes: [
  //     {
  //       id: `_node_${id}_`,
  //       title: `Node-${id}`
  //     },
  //     {
  //       id: `_xxx_`
  //     },
  //   ],
  //   links: [
  //     {
  //       source: `_node_${id}_`,
  //       target: '_xxx_'
  //     }
  //   ]
  // });

  console.log(data);

  return (
    <g>
      <g ref={guides} className={classes.guides} />

      <Graph
        grid={grid}
        data={data}
        layout={layout}
        linkProjector={linkProjector}
        nodeProjector={nodeProjector}
        drag={drag}
      />
    </g>
  );
};

export default EchoGraph;
