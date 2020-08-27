//
// Copyright 2020 DXOS.org
//

import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';

import { FullScreen } from '@dxos/gem-core';

export default {
  title: 'Experimental',
  decorators: [withKnobs]
};

//
// Database => Party => Item => Model
//

export const withHello = () => {
  const { partyKey } = useParams();
  const database = useDatabase();
  const parties = useParties();
  const party = useParty(partyKey);
  const items = useItems(partyKey);

  const handleClick = async () => {
    const item = await party.createItem(ObjectModel.meta, 'wrn://dxos.org/item/document');
    item.setProperty('title', 'Hello');
  };

  return (
    <FullScreen>
      <ul>
        {
          parties.map(party => <li>{party.getProperty('title')}</li>)
        }
      </ul>
      <ul>
        {
          items.map(item => <li>{item.model.getProperty('title')}</li>)
        }
      </ul>
      <Button onClick={handleClick}>New</Button>
    </FullScreen>
  );
};
