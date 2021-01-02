//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import useResizeAware from 'react-resize-aware';
import update from 'immutability-helper';

import {
  createSimulationDrag,
  Graph,
  GraphLinker,
  ForceLayout,
  LinkProjector,
  NodeProjector,
  Markers,
} from '@dxos/gem-spore';
import { FullScreen, SVG, useGrid } from '@dxos/gem-core';

interface LinksGraphProps {
  data: any, // TODO(burdon): Type?
  onCreate: Function,
  classes: any,
  propertyAdapter: Function
}

const LinksGraph = ({ data, onCreate, classes = {}, propertyAdapter }: LinksGraphProps) => {
  const [resizeListener, size] = useResizeAware();
  const { width, height } = size;
  const grid = useGrid({ width, height });
  const [nodeProjector] = useState(() => new NodeProjector({ node: { showLabels: true, propertyAdapter } }));
  const [linkProjector] = useState(() => new LinkProjector({ nodeRadius: 8, showArrows: true }));
  const [layout] = useState(() => new ForceLayout());
  const [drag] = useState(() => createSimulationDrag(layout.simulation, { link: 'metaKey' }));

  return (
    <FullScreen>
      {resizeListener}
      <SVG width={size.width} height={size.height}>
        <Markers arrowSize={10}/>
        <GraphLinker
          grid={grid}
          drag={drag}
          onUpdate={mutations => onCreate((update({ nodes: [], links: [] }, mutations)))}
        />
        <Graph
          grid={grid}
          data={data}
          layout={layout}
          drag={drag}
          nodeProjector={nodeProjector}
          linkProjector={linkProjector}
          classes={{
            nodes: classes.nodes
          }}
        />
      </SVG>
    </FullScreen>
  );
};

export default LinksGraph;
