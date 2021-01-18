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
import { SVG, useGrid } from '@dxos/gem-core';
import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';

interface LinksGraphProps {
  data: any, // TODO(burdon): Type?
  onCreate?: Function,
  classes?: any,
  propertyAdapter?: Function
}

// TODO(burdon): Create container.
const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: 1,
    position: 'relative' // Important
  }
}));

const GraphView = ({ data, onCreate = () => {}, classes = {}, propertyAdapter = () => ({}) }: LinksGraphProps) => {
  const clazzes = { ...useStyles(), ...classes };
  const [resizeListener, size] = useResizeAware();
  const { width, height } = size;
  const grid = useGrid({ width, height });
  const [nodeProjector] = useState(() => new NodeProjector({ node: { showLabels: true, propertyAdapter } }));
  const [linkProjector] = useState(() => new LinkProjector({ nodeRadius: 8, showArrows: true }));
  const [layout] = useState(() => new ForceLayout());
  const [drag] = useState(() => createSimulationDrag(layout.simulation, { link: 'metaKey' }));

  return (
    <div className={clazzes.root}>
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
            nodes: clazzes.nodes
          }}
        />
      </SVG>
    </div>
  );
};

export default GraphView;
