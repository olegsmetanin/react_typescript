import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import {IApiAction} from '../../../framework/client/action/actions';
import {IState} from './models';
import Api from './api';

export async function callThrowEndpoint(options: IApiAction<IState>) {
  const {state, httpClient} = options;
  state.callNumber = state.callNumber || 0;
  state.callNumber++;

  try {
    await (new Api({httpClient})).throwed({counter: state.callNumber});
    state.errors = {general: 'Error not catched!!!'};
  } catch(e) {
    console.log('callThrowEndpoint e', e);
    state.errors = e.errors;
  }
}

export async function callSecuredEndpoint(options: IApiAction<IState>) {
  const {state, httpClient} = options;

  try {
    state.data = await (new Api({httpClient})).secured();
  } catch(e) {
    console.log('callSecuredEndpoint e', e);
    state.errors = e.errors;
  }
}
