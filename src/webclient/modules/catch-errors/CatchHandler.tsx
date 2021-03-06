import * as React from 'react';
import IHTTPClient from '../../framework/common/http/IHTTPClient';
import {IState} from './models';
import Api from './api';
import Actions from './actions';

interface ICatchHandlerContext {
  httpClient : IHTTPClient;
  state      : any;
  setState   : () => void;
}

export default class CatchHandler extends React.Component<React.Props<CatchHandler>, {}> {

  static contextTypes: React.ValidationMap<any> = {
    httpClient: React.PropTypes.object.isRequired,
    state     : React.PropTypes.object.isRequired,
    setState  : React.PropTypes.func.isRequired,
  };

  context: ICatchHandlerContext;
  actions: Actions;

  constructor(props, context) {
    super(props);

    const {httpClient, state, setState} = context;
    const moduleState = state.modules['catch-errors'];
    this.state = moduleState;
    const api = new Api({httpClient});
    this.actions = new Actions({api, state: moduleState, setState: this.createModuleSetState(state, moduleState, setState)});
  }

  createModuleSetState(state, moduleState, setState) {
    return (actionState) => {
      const newModuleState = Object.assign({}, moduleState, actionState);
      const newModules = Object.assign({}, state.modules, {['catch-errors']: newModuleState});
      const newGlobalState = Object.assign({}, state, {modules: newModules});
      //console.log('catch setstate wrapper', actionState, newModuleState, newModules, newGlobalState);

      setState(newGlobalState);
    }
  }

  render() {

    return (
      <div>
        <div>Press btn to call throw api</div>
        <button onClick={() => this.actions.callThrowEndpoint()}>Call throw api</button>
        <br/>
        <div>Press btn to call auth api</div>
        <button onClick={() => this.actions.callSecuredEndpoint()}>Call auth api</button>
      </div>
    )

  }

}
