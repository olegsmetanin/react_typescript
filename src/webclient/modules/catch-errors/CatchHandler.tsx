import * as React from 'react';
import IHTTPClient from '../../framework/common/http/IHTTPClient';
import {IState} from './models';
import {callThrowEndpoint, callSecuredEndpoint} from './actions';

interface ICatchHandlerContext {
  httpClient : IHTTPClient;
  state: IState;
}

export default class CatchHandler extends React.Component<React.Props<CatchHandler>, {}> {

  static contextTypes: React.ValidationMap<any> = {
    httpClient: React.PropTypes.object.isRequired,
    state     : React.PropTypes.object.isRequired,
  }

  context: ICatchHandlerContext;

  constructor(props, context) {
    super(props);

    this.state = context.state;
  }

  callThrowApi = async () => {
    const {httpClient, state} = this.context;

    try {
      await callThrowEndpoint({httpClient, state});
    } finally {
      this.setState(state);
      //This works too
      //this.forceUpdate();
    }
  }

  callAuthorizedApi = async () => {
    const {httpClient, state} = this.context;

    try {
      await callSecuredEndpoint({httpClient, state});
    } finally {
      this.setState(state);
      //This works too
      //this.forceUpdate();
    }
  }

  render() {

    return (
      <div>
        <div>Press btn to call throw api</div>
        <button onClick={this.callThrowApi}>Call throw api</button>
        <br/>
        <div>Press btn to call auth api</div>
        <button onClick={this.callAuthorizedApi}>Call auth api</button>
        <br/>
        <div style={{display: 'block', backgroundColor: '#eee', color: 'red'}}>
          <pre>{JSON.stringify(this.state, null, 2)}</pre>
        </div>
      </div>
    )

  }

}
