//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: 'white',
    opacity: 0.7,
    fontFamily: 'monospace',
    fontSize: 12,
    '& td': {
      paddingLeft: 8,
      paddingRight: 8
    }
  }
}));

/**
 * Items panel.
 */
const ItemList = ({ items = [] }) => {
  const classes = useStyles();
  if (!items.length) {
    return null;
  }

  const sorter = (a, b) => {
    const ta = a.type;
    const tb = b.type;
    return ta < tb ? -1 : tb > ta ? 1 : 0;
  };

  return (
    <div className={classes.root}>
      <table>
        <tbody>
          {items.sort(sorter).map(item => (
            <tr key={item.id}>
              <td className={item.type.split('/').pop()}>
                {item.type}
              </td>
              <td>
                {item.model.getProperty('name')}
              </td>
              <td>
                {item.links.length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemList;
