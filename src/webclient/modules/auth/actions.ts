import IEventBus from '../../../framework/common/event/IEventBus';
import EBEvent from '../../../framework/common/event/EBEvent';
import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import BufferRetryEvent from '../../../framework/client/events/BufferRetry';
import {IUserState} from './models';
import Api from './api';
import BufferDropEvent from "../../../framework/client/events/BufferDrop";
import {IPopupState} from "./models";

interface IActionOptions {
  api      : Api;
  eventBus : IEventBus;
  state    : IUserState;
  setState : (state: any) => void;
}

export default class Actions {

  private options: IActionOptions;

  constructor(options: IActionOptions) {
    this.options = options;
  }

  async me() {
    const {api, state, setState} = this.options;

    let ui = Object.assign({}, state.ui, {loading: true});
    setState({ui});
    try {
      const me = await api.me();
      ui = Object.assign({}, ui, {loading: false});
      setState({me, ui});
    } catch(e) {
      ui = Object.assign({}, ui, {loading: false, error: e.errors});
      setState({ui});
    }
  }

  async login() {
    const {api, state, setState, eventBus} = this.options;

    let popup: IPopupState = state.ui.popup;
    try {
      await api.login();
      await this.me();
      popup = {open: false, auth: false, reconnect: false};
      eventBus.emit(new BufferRetryEvent());
    } catch(e) {
      popup.errors = e.errors;
    } finally {
      const ui = Object.assign({}, state.ui, {popup});
      setState({ui});
    }
  }

  async logout() {
    const {api, state, setState} = this.options;

    let ui = Object.assign({}, state.ui, {loading: true});
    setState({ui});
    try {
      await api.logout();
      setState({me: undefined});
    } catch(e) {
      ui = Object.assign({}, ui, {error: e.errors});
    } finally {
      ui = Object.assign({}, ui, {loading: false});
      setState({ui});
    }
  }

  openPopup(auth: boolean) {
    const {state, setState} = this.options;

    const popup = {
      open: true,
      auth: auth === true,
      reconnect: auth !== true,
    };
    const ui = Object.assign({}, state.ui, {popup});
    setState({ui});
  }

  closePopup(cancel: boolean) {
    const {state, setState, eventBus} = this.options;

    try {
      const event:EBEvent = cancel ? new BufferDropEvent('User cancel pending requests') : new BufferRetryEvent();
      eventBus.emit(event);
    } finally {
      const popup = {open: false, auth: false, reconnect: false};
      const ui = Object.assign({}, state.ui, {popup});
      setState({ui});
    }
  }

}
