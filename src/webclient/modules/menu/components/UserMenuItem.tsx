/// <reference path="../../../webclient.d.ts"/>

import * as React from 'react';
const ReactRouter = require('react-router');
const { Link } = ReactRouter;
import OAuthPopup from './../../auth/components/OAuthPopup';
import {IUser, IUserState} from './../../auth/models';

interface IUserMenuItemProps {
  auth: IUserState;
  onLogout: () => void;
}

export default class UserMenuItem extends React.Component<IUserMenuItemProps, {}> {

  render() {
    let {auth:{me, ui}} = this.props;

    return (
      <div>
        {me
          ? <div>
              {/*JSON.stringify(me)*/}
              {me.first_name + ' ' + me.last_name}
              <img src={me.picurl}/>
              <button onClick={() => this.props.onLogout()}>
                Logout
              </button>
            </div>
          : !ui.loading
            ? <div>
                <OAuthPopup type='facebook'>
                  Login with facebook
                </OAuthPopup>
              </div>
            : <div>Loading user...</div>
        }
      </div>
    )
  }

}
