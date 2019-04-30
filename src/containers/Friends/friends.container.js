import React from 'react';
import { FriendsContainer, FriendsWrapper } from './friends.style';
import FriendsComponent from './friends.component';
import { useLDflexValue } from '@solid/react';

function Friends() {
  const name = useLDflexValue('user[vcard_fn]');;
  return (
    <FriendsWrapper data-testid="profile-component">
      <FriendsContainer>
          {name && <h1>{name.toString()}'s Friends</h1>}
          <FriendsComponent />
      </FriendsContainer>
    </FriendsWrapper>
  );
}

export default Friends;
