/// <reference path="webclient.d.ts"/>
import * as React from 'react';
import * as ReactDOM from 'react-dom';
//waiting for actual d.ts
const ReactRouter = require('react-router');
const Router = ReactRouter.Router;
import {
  Store,
  compose,
  createStore,
  bindActionCreators,
  combineReducers,
  applyMiddleware
} from 'redux';
import {
  connect,
  Provider
} from 'react-redux';
import { Action } from 'redux-actions';
import thunk from 'redux-thunk';

import routes from './routes/index';
import Context from '../framework/common/react/Context';
import invoke from '../framework/client/invoke/invoke';
import HTTPClient from '../framework/client/http/HTTPClient';
import HTTPBuffer from '../framework/client/http/HTTPBuffer';
import Cache from '../framework/common/cache/Cache';
import EventBus from '../framework/common/event/EventBus';
import {rootReducer as modulesRootReducer} from './modules/rootReducer';

window['app'] = (options: any) => {
  const {el, cachedump, state} = options;

  const cache = new Cache();
  cache.load(cachedump);

  const eventBus = new EventBus({});
  const httpClient = new HTTPClient({});
  const httpBuffer = new HTTPBuffer({httpClient, eventBus});

  const initialState: any = state;//TODO typed and dehidrated from server (instead of cache)
  const rootReducer = combineReducers({
    app: (state, action: Action) => ({}),//TODO app-wide state
    modules: modulesRootReducer
  });
  const finalCreateStore = compose(
    applyMiddleware(thunk)
    //TODO redux-react-router???
  )(createStore);
  const store = finalCreateStore(rootReducer, initialState);

  const createBrowserHistory = require('history/lib/createBrowserHistory');
  const useScroll = require('scroll-behavior/lib/useStandardScroll');
  const history = useScroll(createBrowserHistory)();
  ReactDOM.render(
    <Provider store={store}>
      <Context
        invoke={invoke}
        cache={cache}
        httpClient={httpBuffer}
        eventBus={eventBus}
        render={() => <Router history={history}>{routes}</Router>}
      />
    </Provider>,
    el
  );

}