import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import {IState} from './models';
import Api from './api';

interface IActionOptions {
  api      : Api;
  state    : IState;
  setState : (state: any) => void;
}

export default class Actions {

  private options: IActionOptions;

  constructor(options: IActionOptions) {
    this.options = options;
  }

  async callThrowEndpoint() {
    const {api, state, setState} = this.options;
    let {callNumber = 0} = state;
    callNumber++;

    try {
      setState({callNumber});
      await api.throwed({counter: callNumber});
      setState({errors: {general: 'Error not catched!!!'}});
    } catch(e) {
      console.log('callThrowEndpoint e', e);
      setState({errors: e.errors});
    }
  }

  async callSecuredEndpoint() {
    const {api, state, setState} = this.options;

    try {
      const data = await api.secured();
      setState({data});
    } catch(e) {
      console.log('callSecuredEndpoint e', e);
      setState({errors: e.errors});
    }
  }

}


