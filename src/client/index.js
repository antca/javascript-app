import React from 'react';
import ReactDOM from 'react-dom';
import createFlux from '../nexus/createFlux';

import App from '../components/App';

const appDOMElement = document.querySelector('#app');
const flux = createFlux({ window });
flux.loadState(JSON.parse(appDOMElement.dataset.flux));

const app = React.createElement(App, { flux });

ReactDOM.render(app, appDOMElement);

if(module.hot) {
  const { AppContainer } = require('react-hot-loader');
  function renderApp() {
    ReactDOM.render(
      React.createElement(
        AppContainer,
        null,
        React.createElement(require('../components/App').default, { flux }),
      ),
      appDOMElement,
    );
  }

  module.hot.accept('../components/App', () => {
    renderApp();
  });

  renderApp();
}
