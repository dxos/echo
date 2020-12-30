//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#FFF',
    padding: 6,
    border: '1px solid #999',
    fontFamily: 'monospace',
    fontSize: 16
  },
  type: {
    color: '#999',
    paddingRight: 8
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemList;
