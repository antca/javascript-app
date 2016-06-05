import React from 'react';
import ReactDOM from 'react-dom';
import { Router, match, browserHistory } from 'react-router';
import { Provider } from 'react-tunnel';
import { Resolver } from 'react-resolver';

import createStore from '../data/createStore';

const appDOMElement = document.querySelector('#app');

function createApp() {
  return new Promise((resolve) => {
    match(
      { history: browserHistory, routes: require('../components/routes').default },
      (error, redirectLocation, renderProps) => {
        const router = React.createElement(Router, renderProps);
        const provider = React.createElement(Provider, { provide: { store: createStore() } }, () => router);
        return resolve(provider);
      });
  });
}

createApp().then((app) => Resolver.render(() => app, appDOMElement));

if(module.hot) {
  const { AppContainer } = require('react-hot-loader');
  function renderApp() {
    return createApp().then((app) => {
      Resolver.render(
        () => React.createElement(
          AppContainer,
          null,
          app,
        ),
        appDOMElement,
      );
    });
  }

  module.hot.accept('../components/routes', () => {
    renderApp();
  });

  renderApp();
}
