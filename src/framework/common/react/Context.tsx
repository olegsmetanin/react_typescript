import * as React from 'react';
var ReactRouter = require('react-router');
import IInvoke from '../invoke/IInvoke';
import ICache from '../cache/ICache';
import IHTTPClient from '../http/IHTTPClient';
import IEventBus from "../event/IEventBus";

interface IContextProps {
  invoke     : IInvoke;
  cache      : ICache;
  render     : Function;
  httpClient : IHTTPClient;
  eventBus   : IEventBus;
  state      : any;
}

export default class Context extends React.Component<IContextProps, {}> {

  static childContextTypes: React.ValidationMap<any> = {
    cache      : React.PropTypes.object.isRequired,
    invoke     : React.PropTypes.func.isRequired, //TODO to delete
    httpClient : React.PropTypes.object.isRequired,
    eventBus   : React.PropTypes.object.isRequired,
    state      : React.PropTypes.object.isRequired,
    setState   : React.PropTypes.func.isRequired,
  }

  getChildContext () {
    return {
      cache      : this.props.cache,
      invoke     : this.props.invoke, //TODO to delete
      httpClient : this.props.httpClient,
      eventBus   : this.props.eventBus,
      state      : this.state || this.props.state,
      setState   : this.setState.bind(this),
    };
  }

  constructor(props, context) {
    super(props, context);

    this.state = props.state;
  }

  render() {
    return this.props.render();
  }

}
