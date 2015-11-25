import * as React from 'react';
const ReactRouter = require('react-router');
const { Link } = ReactRouter;
const DocumentMeta = require('react-document-meta');
import IHTTPClient from '../../../framework/common/http/IHTTPClient';
import {IUserState} from './../auth/models';
import Api from './../auth/api';
import Actions from './../auth/actions';
import Menu from '../menu/Menu';
import Popup from './../auth/components/Popup';

interface ILayoutState {
  clientWidth : number;
  data        : IUserState;
}

interface ILayoutContext {
  httpClient : IHTTPClient;
  state      : any;
  setState   : (state: any) => void;
}

export default class Layout extends React.Component<React.Props<Layout>, ILayoutState> {

  constructor(props, context) {
    super(props, context);

    const {httpClient, state, setState} = context;
    const moduleState = state.modules.auth;
    this.state = {
      clientWidth: 400,
      data: moduleState,
    };
    const api = new Api({httpClient});
    this.actions = new Actions({api, state: moduleState, setState});
  }

  context: ILayoutContext;
  actions: Actions;
  state: ILayoutState;

  static contextTypes: React.ValidationMap<any> = {
    httpClient : React.PropTypes.object.isRequired,
    state      : React.PropTypes.object.isRequired,
    setState   : React.PropTypes.func.isRequired,
  };

  handleResize(e) {
    // if (document) {
    //   this.setState({clientWidth: document.getElementById('app').clientWidth});
    // }
  }

  componentDidMount() {
    this.handleResize(null);
    window.addEventListener('resize', this.handleResize.bind(this));
    if (!window['loginCallBack']) {
      window['loginCallBack'] = () => this.actions.me();
    }
  }

  componentWillMount() {
    if (typeof window !== 'undefined') {
      //console.log(`${new Date().toISOString()} dispatching action requestMe`);
      this.actions.me();
      //console.log(`${new Date().toISOString()} dispatched action requestMe`);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  render() {
    var w = this.state.clientWidth;
    let xstyle = w < 401
      ? 'xx'
      : w < 768
        ? 'xs'
        : w < 991
          ? 'sm'
          : w < 1299
            ? 'md'
            : 'lg';

    const {data} = this.state;
    return (

      <div className={xstyle}>
        <Popup />
        <DocumentMeta title={'React-blog'} />
        <Menu
          auth={data}
          onLogout={() => this.actions.logout()}
        />

        {this.props.children}
      </div>
    )
  }

}
