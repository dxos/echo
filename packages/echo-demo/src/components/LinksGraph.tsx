//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import useResizeAware from 'react-resize-aware';
import update from 'immutability-helper';
import { makeStyles } from '@material-ui/core/styles';
import * as colors from '@material-ui/core/colors';

import {
  createSimulationDrag,
  Graph,
  GraphLinker,
  ForceLayout,
  LinkProjector,
  NodeProjector,
  Markers,
} from '@dxos/gem-spore';
import { FullScreen, SVG, useGrid, Grid } from '@dxos/gem-core';

interface LinksGraphProps {
  data: any, // TODO(burdon): Type?
  onCreate: Function
}

const useCustomStyles = makeStyles(() => ({
  nodes: {
    '& g.node text': {
      fill: colors['grey'][700],
      fontFamily: 'sans-serif',
      fontSize: 12
    },
    '& g.node.org circle': {
      fill: colors['blue'][200],
      stroke: '#0000000',
      strokeWidth: 4
    },
    '& g.node.person circle': {
      fill: colors['green'][200],
      stroke: '#0000000',
      strokeWidth: 4
    }
  }
}));

const LinksGraph = ({ data, onCreate }: LinksGraphProps) => {
  const classes = useCustomStyles();
  const [resizeListener, size] = useResizeAware();
  const { width, height } = size;
  const grid = useGrid({ width, height });
  const [nodeProjector] = useState(() => new NodeProjector({
    node: {
      showLabels: true,
      propertyAdapter: (node) => ({
        class: node.type,
        radius: node.type === 'org' ? 16: 8
      })
    }
  }));
  const [linkProjector] = useState(() => new LinkProjector({ nodeRadius: 8, showArrows: true }));
  const [layout] = useState(() => new ForceLayout());
  const [drag] = useState(() => createSimulationDrag(layout.simulation, { link: 'metaKey' }));

  return (
    <FullScreen>
      {resizeListener}
      <SVG width={size.width} height={size.height}>
        <Grid grid={grid} />
        <Markers arrowSize={8}/>
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
