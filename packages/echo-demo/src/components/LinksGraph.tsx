import React, { useState } from 'react'
import {Database} from '@dxos/echo-db'
import { truncateString } from '@dxos/debug';
import { useSelection } from '../useSelection'
import {
  createSimulationDrag,
  useGraphStyles,
  Graph,
  ForceLayout,
  LinkProjector,
  NodeProjector,
  Markers,
} from '@dxos/gem-spore';
import useResizeAware from 'react-resize-aware';
import { FullScreen, SVG, useGrid, Grid } from '@dxos/gem-core';

export interface LinksGraphProps {
  database: Database
}

export const OBJECT_PERSON = 'dxn:echo.dxos:object/person';
export const OBJECT_ORG = 'dxn:echo.dxos:object/org';
export const LINK_EMPLOYEE = 'dxn:echo.dxos:link/employee';


export const LinksGraph = ({database}: LinksGraphProps) => {
  const data = useSelection(database.select(), selection => {
    const nodes = [], links = [];

    selection
      .select({ type: OBJECT_ORG })
      .each(item => nodes.push({
        id: item.id,
        type: 'org',
        title: item.model.getProperty('name')
      }))
      .select({ link: LINK_EMPLOYEE })
        .each(link => links.push({
          id: link.id,
          source: link.source.id,
          target: link.target.id
        }))
        .target()
          .each(item => nodes.push({
            id: item.id,
            type: 'person',
            title: item.model.getProperty('name')
          }))

    return { nodes, links }
  }, [])

  const [resizeListener, size] = useResizeAware();
  const { width, height } = size;
  const grid = useGrid({ width, height });
  const [nodeProjector] = useState(() => new NodeProjector({
    node: {
      showLabels: true,
    }
  }))
  const [linkProjector] = useState(() => new LinkProjector({ nodeRadius: 8, showArrows: true }))
  const [layout] = useState(() => new ForceLayout());
  const [drag] = useState(() => createSimulationDrag(layout.simulation, { link: 'metaKey' }));

  return (
    <FullScreen>
      {resizeListener}
      <SVG width={size.width} height={size.height}>
        <Grid grid={grid} />
        <Markers arrowSize={8}/>
        <Graph
          grid={grid}
          data={data}
          layout={layout}
          drag={drag}
          nodeProjector={nodeProjector}
          linkProjector={linkProjector}
        />
      </SVG>
    </FullScreen>
  );
}
