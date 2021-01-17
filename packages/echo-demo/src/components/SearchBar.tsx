//
// Copyright 2020 DXOS.org
//

import React, {useState} from 'react';
import { TextField } from "@material-ui/core";

const SearchBar = ({ onUpdate = console.log }) => {
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
    <div>
      <TextField
        autoFocus
        fullWidth
        spellCheck={false}
        value={text}
        onChange={ev => setText(ev.target.value)}
        onKeyUp={handleKeyDown}
      />
    </div>
  );
}

export default SearchBar;
