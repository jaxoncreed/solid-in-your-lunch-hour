import React, { Component, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FriendListItem, FriendLink } from './friends.style';
import data from '@solid/query-ldflex'
import { namedNode } from '@rdfjs/data-model';

class FriendsComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      friends: []
    };
    this.addFriendRef = React.createRef();
    this.pastContext = {};
  }

  async componentDidMount () {
    await this.fetchFriends();
  }

  fetchFriends = async () => {
    const ldFriends = data.user.friends;
    for await (const ldFriend of ldFriends) {
      console.log(ldFriend.value)
      try {
        this.setState({
          friends: [
            ...this.state.friends, 
            {
              name: (await data[ldFriend.value].vcard_fn).value,
              webId: ldFriend.value
            }
          ]
        });
      } catch(err) {}
    }
  }

  addFriend = async (webId) => {
    const node = data.user.friends;
    await node.add(namedNode(webId));
  }

  removeFriend = async (webId) => {
    const node = data.user.friends;
    await node.delete(namedNode(webId));
  }

  render() {
    console.log(this.state);
    return (
      <Fragment>
        <ul>
          {this.state.friends.map(friend => (
            <FriendListItem key={friend.webId}>
              <FriendLink href={friend.webId}>
                {friend.name}
              </FriendLink>
              <FontAwesomeIcon
                icon="times"
                style={{ cursor: 'pointer' }}
                onClick={() => this.removeFriend(friend.webId)}
              />
            </FriendListItem>
          ))}
        </ul>
        <form onSubmit={async (e) => {
          e.preventDefault();
          await this.addFriend(this.addFriendRef.current.value);
          this.addFriendRef.current.value = '';
        }}>
          <input type="text" ref={this.addFriendRef} placeholder="New Friend's WebId" />
          <input type="submit" value="Add a New Friend" />
        </form>
      </Fragment>
    );
  }
};

export default FriendsComponent;
