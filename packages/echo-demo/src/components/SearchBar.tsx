//
// Copyright 2020 DXOS.org
//

import React, {useState} from 'react';
import { Input, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flex: 1
  }
}));

const SearchBar = ({ classes = {}, onUpdate = console.log }) => {
  const clazzes = { ...useStyles(), ...classes };
  const [text, setText] = useState('');

  const handleKeyDown = ev => {
    switch (ev.key) {
      case 'Escape': {
        setText('');
        onUpdate('');
        break;
      }
      case 'Enter': {
        onUpdate(text);
        break;
      }
    }
  };

  return (
    <div className={clazzes.root}>
      <TextField
        autoFocus
        fullWidth
        variant='outlined'
        spellCheck={false}
        value={text}
        onChange={ev => setText(ev.target.value)}
        onKeyUp={handleKeyDown}
        InputProps={{
          endAdornment:
            <InputAdornment position="end">
              <IconButton
                size='small'
                onClick={() => onUpdate(text)}
                onMouseDown={() => onUpdate(text)}
              >
                <SearchIcon/>
              </IconButton>
            </InputAdornment>
        }}
      />
    </div>
  );
};

export default SearchBar;
