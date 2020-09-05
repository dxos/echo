//
// Copyright 2020 DXOS.org
//

// @ts-ignore
import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import * as colors from '@material-ui/core/colors';

import {
  createSimulationDrag,
  useGraphStyles,
  Graph,
  ForceLayout,
  LinkProjector,
  NodeProjector,
// @ts-ignore
} from '@dxos/gem-spore';

import { ObjectModel } from '@dxos/experimental-object-model';

import { useDatabase, useGraphData } from '../hooks';

const useCustomStyles = makeStyles(() => ({
  nodes: {
    '& g.node.database circle': {
      fill: colors['blue'][400]
    },
    '& g.node.party circle': {
      fill: colors['red'][400]
    },
    '& g.node.item circle': {
      fill: colors['grey'][400]
    },
  }
}));

/**
 * @param id
 * @param grid
 * @param dx
 * @constructor
 */
const EchoGraph = ({ id, grid, dx }: { id: string, grid: any, dx: number }) => {
  const classes = useGraphStyles();
  const customClasses = useCustomStyles();
  const guides = useRef();

  // TODO(burdon): Resets on update (must preserve/merge data).
  // TODO(burdon): Is the data updated and corrupted by node projector?
  const database = useDatabase();
  const data = useGraphData({ id });
  // console.log('###', data);

  const [{ nodeProjector, linkProjector }] = useState({
    nodeProjector: new NodeProjector({
      node: {
        radius: 16,
        showLabels: true,
        propertyAdapter: ({ type  }) => ({
          class: type,
          radius: {
            database: 25,
            party: 20,
            item: 10
          }[type]
        })
      }
    }),
    linkProjector: new LinkProjector({ nodeRadius: 16, showArrows: true })
  });

  const [layout] = useState(new ForceLayout({
    center: (grid: any) => ({ x: grid.center.x + grid.scaleX(dx), y: grid.center.y })
  }));

  const [selected, setSelected] = useState();
  const [drag] = useState(() => createSimulationDrag(layout.simulation, { link: 'metaKey' }));
  useEffect(() => {
    // TODO(burdon): Click to open.
    // TODO(burdon): Drag to invite?
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

      setImmediate(async () => {
        switch (source.type) {
          case 'database': {
            await database.createParty();
            break;
          }

          case 'party': {
            const party = await database.getParty(source.partyKey);
            await party.createItem(ObjectModel.meta.type);
            break;
          }

          case 'item': {
            console.log('### CHILD ITEM ###');
            break;
          }
        }
      });

      linkProjector.update(grid, {}, { group: guides.current });
    });
  }, [drag]);

  return (
    <g>
      <g ref={guides} className={classes.links} />

      <Graph
        grid={grid}
        data={data}
        layout={layout}
        classes={{
          nodes: customClasses.nodes
        }}
        linkProjector={linkProjector}
        nodeProjector={nodeProjector}
        drag={drag}
      />
    </g>
  );
};

export default EchoGraph;
