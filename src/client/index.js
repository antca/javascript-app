import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom';

import createFlux from '../nexus/createFlux';
import { b642js } from '../util/b64';
const App = require('../components/App').default;

const appDOMElement = document.querySelector('#app');

const flux = createFlux();
flux.loadState(b642js(appDOMElement.dataset.flux));

const app = React.createElement(App, { flux });
ReactDOM.render(app, appDOMElement);

if(module.hot) {
  module.hot.accept('../components/App', () => {
    const app = React.createElement(require('../components/App').default, { flux });
    ReactDOM.render(app, appDOMElement);
  });
}
