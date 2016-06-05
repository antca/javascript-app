import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { Provider } from 'react-tunnel';
import { Resolver } from 'react-resolver';

import createStore from '../data/createStore';
import routes from '../components/routes';
import Index from '../components/Index';

async function renderApp({ url }) {
  return new Promise((resolve, reject) => {
    match({ routes, location: url }, (error, redirectLocation, renderProps) => {
      if(error) {
        return reject(error);
      }
      if(redirectLocation) {
        return resolve({ redirectLocation });
      }
      if(renderProps) {
        const router = React.createElement(RouterContext, renderProps);
        const provider = React.createElement(Provider, { provide: { store: createStore() } }, () => router);
        return Resolver.resolve(() => provider).then(({ Resolved, data }) => {
          const resolved = React.createElement(Resolved);
          const appMarkup = ReactDOM.renderToString(resolved);
          const index = React.createElement(Index, {
            markup: appMarkup,
            data,
          });
          return resolve({ page: `<!DOCTYPE html>${ReactDOM.renderToStaticMarkup(index)}` });
        }).catch(reject);
      }
      resolve({ notFound: true });
    });
  });
}

async function renderStaticPage(url) {
  const { notFound, redirectLocation, page } = await renderApp({ url });
  if(notFound) {
    throw new Error('Page was not found !');
  }
  if(redirectLocation) {
    return renderStaticPage(redirectLocation.pathname + redirectLocation.search);
  }
  return page;
}

export { renderStaticPage };
export default renderApp;
