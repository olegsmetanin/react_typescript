/// <reference path="webclient.d.ts"/>
import * as React from 'react';
import * as ReactDOM from 'react-dom';
//waiting for actual d.ts
const ReactRouter = require('react-router');
const Router = ReactRouter.Router;

import routes from './routes/index';
import Context from '../framework/common/react/Context';
import invoke from '../framework/client/invoke/invoke';
import HTTPClient from '../framework/client/http/HTTPClient';
import HTTPBuffer from '../framework/client/http/HTTPBuffer';
import Cache from '../framework/common/cache/Cache';
import EventBus from '../framework/common/event/EventBus';
import modulesState from './modules/state';

window['app'] = (options: any) => {
  const {el, cachedump, state} = options;

  const cache = new Cache();//TODO replace with state and remove
  cache.load(cachedump);

  const eventBus = new EventBus({});
  const httpClient = new HTTPClient({});
  const httpBuffer = new HTTPBuffer({httpClient, eventBus});

  const appState: any = state || {
      app: {}, //TODO app-wide state
      modules: modulesState
  };//TODO typed and dehidrated from server (instead of cache)

  const createBrowserHistory = require('history/lib/createBrowserHistory');
  const useScroll = require('scroll-behavior/lib/useStandardScroll');
  const history = useScroll(createBrowserHistory)();
  //TODO delete invoke
  ReactDOM.render(
    <Context
      invoke={invoke}
      cache={cache}
      httpClient={httpBuffer}
      eventBus={eventBus}
      state={appState}
      render={() => <Router history={history}>{routes}</Router>}
    />,
    el
  );

}
