# Solid in your lunch hour

In this tutorial, you will build a Solid application using the recat-generator developed by Inrupt. The final result is provided in this repository.

## 1. Intallation
To install the generator:

```bash
npm install -g @inrupt/generator-solid-react
```

## 2. Generating the Boilerplate Code
Once the generator is installed, you can create a new application with just a few steps.

1. In a console window, navigate to the desired parent folder of the new application.
2. Use the command: ``` yo @inrupt/solid-react ```
3. You will be prompted to set:
   1. An application name. This will also be the name of the new folder in which the new application lives.
   2. A version number.
   3. Whether the application is private or public.
4. Navigate into the new folder.
5. If you would like to start the application, simply run ``` npm run start ``` in the new folder, otherwise you can begin editing and writing your application!

## 3. Run the Generated Code

`cd` into the generated directory to run the `start` script.
```bash
cd my-project
npm run start
```

A browser window should open automatically. If not, navigate to `http://localhost:3000`.

## 4. Create a Solid Identity
Select "Register with a Solid Identity" from the login page. You will be met with a choice of two providers. Future versions of the generator will include more. For the most part, both are identical.

 - [Solid Community](https://solid.community) is hosted by MIT and your webId will look like `myid.solid.community/profile/card#me`.
 - [Inrupt](https://inrupt.net) is a pod provider hosted by Inrupt and your webId will look like `myid.inrupt.net/profile/card#me`.

If you wish, you may also sign up with an independent pod provider or a pod that you host yourself. Just register at the desired website and log into the app using your new webId.

Once you've registered, either "Log in with Provider" and select your desired pod provider, or type your webId to log in.

## 5. Explore the Generated App
The generated app is a basic profile editor. You can upload a profile picture, describe your job, and provide contact information. Get an idea for what the app does and explore the code a bit to familiarize yourself with how it works.

## 6. Create a Friends Page

We'll add a new page that will view, add, and remove your Solid friends. To do so, let's create a new file and intialize it with React. There's no Solid specific stuff in this step, we're just setting up the framework for what's next.

containers/Friends/friends.style.js
```javascript
import styled from "styled-components";

import { media } from "../../utils";

export const FriendsWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url("/img/concentric-hex-pattern_2x.png");
  background-repeat: repeat;
  min-height: 79vh;
  padding: 60px 0;
`;
export const FriendsContainer = styled.div`
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
  background-color: white;
  max-width: 900px;
  margin: 0 20px;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  ${media.tablet`
    height: 90%;
  `}
  padding: 20px 40px;
`;

export const FriendListItem = styled.li`
  margin-bottom: 10px;
`

export const FriendLink = styled.a`
  margin-right: 5px;
`
```

containers/Friends/friends.component.js
```javascript
import React, { Component, Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { FriendListItem, FriendLink } from './friends.style';

class FriendsComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      friends: [
        {
          name: 'Michiel de Jong',
          webId: 'https://michielbdejong.inrupt.net/profile/card#me',
        },
        {
          name: 'Mitzi Laszlo',
          webId: 'https://mitzilaszlo.solid.community/profile/card#me'
        }
      ]
    };
    this.addFriendRef = React.createRef();
  }

  async componentDidMount () {
    await this.fetchFriends ();
  }

  fetchFriends = async () => {
    console.log('Fetching Friends')
  }

  addFriend = async (webId) => {
    console.log(`Adding ${webId}`);
  }

  removeFriend = async (webId) => {
    console.log(`Removing ${webId}`);
  }

  render() {
    return (
      <Fragment>
        <ul>
          {this.state.friends.map(friend => (
            <FriendListItem key={friend.webId}>
              <FriendLink href={friend.webId} target="_blank">
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

```

container/Friends/friends.container.js
```javascript
import React from 'react';
import { FriendsContainer, FriendsWrapper } from './friends.style';
import FriendsComponent from './friends.component';

function Friends() {
  const name = 'User';
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
```

containers/Friends/index.js
```javascript
import Friends from './friends.container';

export default Friends;
```

containers/index.js
```javascript
// ...
import Friends from './Friends';

export { Login, Register, RegistrationSuccess, PageNotFound, Welcome, Profile, Friends };
```

routes.js
```javascript
import {
  // ...
  Friends
} from "./containers";

const privateRoutes = [
  // ...
  {
    id: "friends",
    path: "/friends",
    component: Friends
  }

];
```

components/AuthNavBar/auth-nav-bar.component.js
```javascript
const navigation = [
  // ...
  {
    id: 'friends',
    icon: "img/people.svg",
    label: "Friends",
    to: "/friends"
  }
];
```

## 7. Retieve a Value from a Pod using React Hooks

Now that everything is set up, we can start using [LDflex](https://github.com/RubenVerborgh/LDflex) to query the browser. LDflex is a powerful JavaScript library that allows you to query linked data documents in a way familiar to JavaScript developers.

You can use React Hooks to automatically fetch the value you desire. The useLDflexValue hook will fetch the corresponding information with a provided query and re-render the component when it receives a response.

components/Friends/friends.container.js
```javascript
// ...
import { useLDflexValue } from '@solid/react';

function Friends() {
  const name = useLDflexValue('user[vcard_fn]');
// ...
```

## 8. Use the LDflex Playground

Play around with writing LDflex queries via the sandbox at [https://solid.github.io/ldflex-playground/](https://solid.github.io/ldflex-playground/)

Note that the query is `user[vcard_fn]`. That's because `vcard_fn` is a linked data predicate describing a first-name. `user` is shorthand for whatever user is currently logged in. You could just as easily manually input the webId like `[https://jackson.solid.community/profile/card#me].vcard_fn`.

### 9. Other Useful Components

A few other useful components to note are
 - `<Value src="user.vcard_fn" />` component which does exactly the same as the useLDflexValue hook, but in a component form.
 - `useLDflexList(user.friends)` hook which returns an array instead of a single value
 - `<List src="user.friends">` component which is use useLDflexList in component form.

## 8. LDflex Fetch

You're familiar with LDflex now, so let's do a slightly more complicated use case and retieve a list of our friends. Without hooks, we'll need to use the react component's built-in functions.

components/Friends/friends.component.js
```javascript
import data from '@solid/query-ldflex'

class FriendsComponent extends Component {
// ...
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
// ...
```

## 9. LDflex Insert

In order to add a new friend, all you have to do is call `.add` on the desired path, and pass in a `namedNode`.

components/Friends/friends.component.js
```javascript
import { namedNode } from '@rdfjs/data-model';
//...
  addFriend = async (webId) => {
    const node = data.user.friends;
    await node.add(namedNode(webId));
  }
```

## 10. LDflex Delete

Deleting a friend is very similar to adding one.

components/Friends/friends.component.js
```javascript
  removeFriend = async (webId) => {
    const node = data.user.friends;
    await node.delete(namedNode(webId));
  }
```
