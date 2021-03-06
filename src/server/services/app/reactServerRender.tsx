import * as React from 'react';
import { renderToString } from 'react-dom/server';
var ReactRouter = require('react-router');
var { match, RoutingContext } = ReactRouter;

import invoke from '../../../framework/server/invoke/invoke';
import Context from '../../../framework/common/react/Context';
import routes from '../../../webclient/routes/index';
import modulesState from '../../../webclient/modules/state';
import HTTPClient from '../../../framework/server/http/HTTPClient';
import Cache from '../../../framework/common/cache/Cache';
import EventBus from "../../../framework/common/event/EventBus";
import HTMLStab from './HTMLStab';
var DocumentMeta = require('react-document-meta');

export default async function reactServerRender(url, siteroot: string, req, res) {

  const cache = new Cache();
  const httpClient = new HTTPClient(siteroot);
  const eventBus = new EventBus({});

  const initialState: any = {app: {}, modules: modulesState};//TODO typed and dehidrated from server (instead of cache)

  //preload data for rendering
  async function fillCache(routes, methodName, ...args) {
    return Promise.all(routes
      .filter(route => !!route)
      .map(route => route[methodName])
      .filter(method => typeof method === 'function')
      .map(method => method(...args))
    );
  }

  match({ routes, location: url }, async (error, redirectLocation, renderProps) => {

    if (error) {
      res.status(500).send(error.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      //console.log('renderProps', renderProps);
      //because when NotFoundRoute exists, renderProps will be filled for unknown path's,
      //we test this situation manually
      const isNotFound = renderProps.components.some(route => route && route.isNotFound);

      if (isNotFound) {
        res.status(404).send(HTMLStab({content:'Not found', head: 'Not found', cachedump: []}));
      } else {
        try {
          //renderProps.components contains route handlers itself (first elm always undefined, why?)
          await fillCache(renderProps.components, 'fillCache', cache, invoke, httpClient);
          await fillCache(renderProps.components, 'composeState', initialState, httpClient);

          let content = renderToString(
            <Context
              invoke={invoke}
              cache={cache}
              httpClient={httpClient}
              eventBus={eventBus}
              state={initialState}
              render={() => <RoutingContext {...renderProps} />}
            />
          );

          let head = DocumentMeta.renderAsHTML();
          let cachedump = cache.dump();
          const state = initialState;

          res.status(200).send(HTMLStab({content, head, cachedump, state}));
        } catch(e) {
          console.log('React render error: ', e);
          console.error(e.stack);
          res.status(500).send(HTMLStab({content:e.toString(), head: 'Error'}))
        }
      }
    } else {
      res.status(404).send(HTMLStab({content:'Not found', head: 'Not found', cachedump: []}));
    }
  });
}
