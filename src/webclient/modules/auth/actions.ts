import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import {IUserState} from './models';
import Api from './api';

interface IActionOptions {
  api      : Api;
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

    state.ui.loading = true;
    setState(state);
    try {
      state.me = await api.me();
    } catch(e) {
      state.ui.error = e.errors;
    } finally {
      state.ui.loading = false;
      setState(state);
    }
  }

  async logout() {
    const {api, state, setState} = this.options;

    state.ui.loading = true;
    setState(state);
    try {
      await api.logout();
      state.me = undefined;
    } catch(e) {
      state.ui.error = e.errors;
    } finally {
      state.ui.loading = false;
      setState(state);
    }
  }
}
