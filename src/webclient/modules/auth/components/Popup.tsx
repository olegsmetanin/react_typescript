import * as React from 'react';
var ReactRouter = require('react-router');
import IEventBus from '../../../../framework/common/event/IEventBus';
import AuthRequiredEvent from '../../../../framework/client/events/AuthRequired';
import ConnectionBrokenEvent from '../../../../framework/client/events/ConnectionBroken';
import {IPopupState} from '../models';

interface IPopupContext {
  history  : any;
  eventBus : IEventBus;
}

interface IPopupProps extends React.Props<Popup> {
  login      : () => void;
  openPopup  : (auth: boolean) => void;
  closePopup : (cancel: boolean) => void;
  state      : IPopupState;
}

export default class Popup extends React.Component<IPopupProps, {}> {

  static contextTypes: React.ValidationMap<any> = {
    history    : React.PropTypes.object.isRequired,
    eventBus   : React.PropTypes.object.isRequired,
  }

  context: IPopupContext;

  componentWillMount() {
    this.context.eventBus.on<AuthRequiredEvent>(AuthRequiredEvent.type, this.onAuthRequired);
    this.context.eventBus.on<ConnectionBrokenEvent>(ConnectionBrokenEvent.type, this.onConnectionBroken);
  }

  componentWillUnmount() {
    this.context.eventBus.off<AuthRequiredEvent>(AuthRequiredEvent.type, this.onAuthRequired);
    this.context.eventBus.off<ConnectionBrokenEvent>(ConnectionBrokenEvent.type, this.onConnectionBroken);
  }

  onAuthRequired = () => {
    const {state: {open}} = this.props;
    if (open) return;

    this.props.openPopup(true);
  }

  onConnectionBroken = () => {
    const {state: {open}} = this.props;
    if (open) return;

    this.props.openPopup(false);
  }

  cancel = () => {
    this.props.closePopup(true);
    this.context.history.pushState(null, '/');
  }

  render() {
    const {state:{open, auth, reconnect, errors}} = this.props;

    return !open ? null : (
      <div className="popup" style={{width: '40%', height: '200px', position: 'absolute', left: '30%', backgroundColor: '#eee'}}>
        {auth && <div>Login required</div>}
        {auth && <button type="button" onClick={() => this.props.login()}>Login</button>}

        {reconnect && <div>Offline. Try to reconnect</div>}
        {reconnect && <button type="button" onClick={() => this.props.closePopup(false)}>Reconnect</button>}

        <button type="button" onClick={this.cancel}>Cancel</button>
        {errors && <div style={{color: 'red'}}>{JSON.stringify(errors)}</div>}
      </div>
    )
  }

}
