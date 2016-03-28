import React from 'react';
import ReactDOM from 'react-dom';
import createFlux from '../nexus/createFlux';

const appDOMElement = document.querySelector('#app');
const flux = createFlux({ window });
flux.loadState(JSON.parse(appDOMElement.dataset.flux));

function renderApp() {
  const app = React.createElement(require('../components/App').default, { flux });
  ReactDOM.render(app, appDOMElement);
}

if(module.hot) {
  module.hot.accept('../components/App', () => {
    renderApp();
  });
}

renderApp();
