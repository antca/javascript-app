import React from 'react';
import ReactDOM from 'react-dom';
import { Router, match, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import createStore from '../redux/createStore';

const appDOMElement = document.querySelector('#app');
const store = createStore(browserHistory, window.__REDUX_STATE__);
const history = syncHistoryWithStore(browserHistory, store);

function createApp() {
  return new Promise((resolve) => {
    match(
      { history, routes: require('../components/routes').default },
      (error, redirectLocation, renderProps) => {
        const router = React.createElement(Router, renderProps);
        const provider = React.createElement(Provider, { store }, router);
        return resolve(provider);
      });
  });
}

createApp().then((app) => ReactDOM.render(app, appDOMElement));

if(module.hot) {
  const { AppContainer } = require('react-hot-loader');
  function renderApp() {
    return createApp().then((app) => {
      ReactDOM.render(
        React.createElement(
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
