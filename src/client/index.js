import React from 'react';
import ReactDOM from 'react-dom';
import { Router, match, browserHistory } from 'react-router';

const appDOMElement = document.querySelector('#app');

function createApp() {
  return new Promise((resolve) => {
    match(
      { history: browserHistory, routes: require('../components/routes').default },
      (error, redirectLocation, renderProps) => resolve(React.createElement(Router, renderProps)))
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
