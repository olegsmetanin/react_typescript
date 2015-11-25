import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import {IState} from './models';
import Api from './api';

interface IActionOptions {
  api      : Api;
  state    : IState;
  setState : () => void;
}

export default class Actions {

  private options: IActionOptions;

  constructor(options: IActionOptions) {
    this.options = options;
  }

  async callThrowEndpoint() {
    const {api, state, setState} = this.options;
    state.callNumber = state.callNumber || 0;
    state.callNumber++;

    try {
      await api.throwed({counter: state.callNumber});
      state.errors = {general: 'Error not catched!!!'};
    } catch(e) {
      console.log('callThrowEndpoint e', e);
      state.errors = e.errors;
    } finally {
      setState();
    }
  }

  async callSecuredEndpoint() {
    const {api, state, setState} = this.options;

    try {
      state.data = await api.secured();
    } catch(e) {
      console.log('callSecuredEndpoint e', e);
      state.errors = e.errors;
    } finally {
      setState();
    }
  }

}


