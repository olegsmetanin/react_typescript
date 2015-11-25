import IEventBus from '../../../framework/common/event/IEventBus';
import EBEvent from '../../../framework/common/event/EBEvent';
import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import BufferRetryEvent from '../../../framework/client/events/BufferRetry';
import {IUserState} from './models';
import Api from './api';
import BufferDropEvent from "../../../framework/client/events/BufferDrop";

interface IActionOptions {
  api      : Api;
  eventBus : IEventBus;
  state    : IUserState;
  setState : () => void;
}

export default class Actions {

  private options: IActionOptions;

  constructor(options: IActionOptions) {
    this.options = options;
  }

  async me() {
    const {api, state, setState} = this.options;

    state.ui.loading = true;
    setState();
    try {
      state.me = await api.me();
    } catch(e) {
      state.ui.error = e.errors;
    } finally {
      state.ui.loading = false;
      setState();
    }
  }

  async login() {
    const {api, state, setState, eventBus} = this.options;

    try {
      await api.login();
      await this.me();
      state.ui.popup = {open: false, auth: false, reconnect: false};
      eventBus.emit(new BufferRetryEvent());
    } catch(e) {
      state.ui.popup.errors = e.errors;
    } finally {
      setState();
    }
  }

  async logout() {
    const {api, state, setState} = this.options;

    state.ui.loading = true;
    setState();
    try {
      await api.logout();
      state.me = undefined;
    } catch(e) {
      state.ui.error = e.errors;
    } finally {
      state.ui.loading = false;
      setState();
    }
  }

  openPopup(auth: boolean) {
    const {state, setState} = this.options;

    state.ui.popup = {
      open: true,
      auth: auth === true,
      reconnect: auth !== true,
    };

    setState();
  }

  closePopup(cancel: boolean) {
    const {state, setState, eventBus} = this.options;

    try {
      state.ui.popup = {open: false, auth: false, reconnect: false};
      const event:EBEvent = cancel ? new BufferDropEvent('User cancel pending requests') : new BufferRetryEvent();
      eventBus.emit(event);
    } finally {
      setState();
    }
  }

}
