import * as React from 'react';
const ReactRouter = require('react-router');
const { Link } = ReactRouter;
import Popup from './../auth/components/Popup';
const DocumentMeta = require('react-document-meta');
import Menu from '../menu/Menu';
import {IUser, IAuthState} from './../auth/model';
import * as MeActions from './../auth/actions';
import IHTTPClient from "../../../framework/common/http/IHTTPClient";

interface ILayoutState {
  clientWidth: number;
}

interface ILayoutContext {
  httpClient : IHTTPClient;
  state      : any;
}

export default class Layout extends React.Component<React.Props<Layout>, ILayoutState> {

  constructor(props, context) {
    super(props, context);
  }

  context: ILayoutContext;

  static contextTypes: React.ValidationMap<any> = {
    httpClient : React.PropTypes.object.isRequired,
    state      : React.PropTypes.object.isRequired,
  };

  state: ILayoutState = {
    clientWidth: 400
  }

  handleResize(e) {
    // if (document) {
    //   this.setState({clientWidth: document.getElementById('app').clientWidth});
    // }
  }

  componentDidMount() {
    this.handleResize(null);
    window.addEventListener('resize', this.handleResize.bind(this));
    if (!window['loginCallBack']) {
      //FIXME window['loginCallBack'] = () => this.state.actions.requestMe(this.context.httpClient);
    }
  }

  componentWillMount() {
    if (typeof window !== 'undefined') {
      console.log(`${new Date().toISOString()} dispatching action requestMe`);
      //FIXME this.state.actions.requestMe(this.context.httpClient);
      console.log(`${new Date().toISOString()} dispatched action requestMe`);
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

    const {state:{modules:{auth}}} = this.context;
    return (

      <div className={xstyle}>
        <Popup />
        <DocumentMeta title={'React-blog'} />
        <Menu
          auth={auth}
          onLogout={() => {/*FIXME this.state.actions.requestLogout(this.context.httpClient)*/}}
        />

        {this.props.children}
      </div>
    )
  }

}
