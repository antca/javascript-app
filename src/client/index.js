import React from 'react';
import ReactDOM from 'react-dom';

function renderApp() {
  const appDOMElement = document.querySelector('#app');
  const app = React.createElement(require('../components/App').default);
  ReactDOM.render(app, appDOMElement);
}

if(module.hot) {
  module.hot.accept('../components/App', () => {
    renderApp();
  });
}

renderApp();
