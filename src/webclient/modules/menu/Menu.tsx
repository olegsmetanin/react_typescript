/// <reference path="../../webclient.d.ts"/>

import * as React from 'react';
const ReactRouter = require('react-router');
const { Link } = ReactRouter;
import {IUser, IUserState} from './../auth/models';
import OAuthPopup from './../auth/components/OAuthPopup';
import UserMenuItem from './components/UserMenuItem';

interface IMenuProps {
  auth: IUserState;
  onLogout: () => void;
}

export default class Menu extends React.Component<IMenuProps, {}> {

  render() {
    let {auth} = this.props;

    return (
      <div>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/catch">Catch server error</Link>
        <br/>
        <Link to="/tasks">Master-details example</Link>
        <div>
          <UserMenuItem
            auth={auth}
            onLogout={this.props.onLogout}
          />
        </div>
      </div>
    )
  }

}
