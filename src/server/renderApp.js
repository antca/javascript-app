import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RouterContext, createMemoryHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { Provider } from 'react-redux';

import createStore from '../redux/createStore';
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
        const memoryHistory = createMemoryHistory(url);
        const store = createStore(memoryHistory);
        const history = syncHistoryWithStore(memoryHistory, store);
        const router = React.createElement(RouterContext, renderProps);
        const provider = React.createElement(Provider, { store }, router);
        const appMarkup = ReactDOM.renderToString(provider);
        const index = React.createElement(Index, {
          markup: appMarkup,
          state: store.getState(),
        });
        return resolve({ page: `<!DOCTYPE html>${ReactDOM.renderToStaticMarkup(index)}` });
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
