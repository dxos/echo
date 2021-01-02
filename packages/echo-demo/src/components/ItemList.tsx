//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#FFF',
    opacity: 0.7,
    border: '1px solid #999',
    fontFamily: 'monospace',
    fontSize: 12,
    '& td': {
      paddingLeft: 8,
      paddingRight: 8
    }
  },
  type: {
    color: '#999'
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

  return (
    <div className={classes.root}>
      <table>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td className={classes.type}>
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
