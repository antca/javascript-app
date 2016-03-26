import React from 'react';
import ReactDOM from 'react-dom/server';

import App from '../components/App';
import Index from '../components/Index';
import createFlux from '../nexus/createFlux';

function render(locals, callback) {
  const flux = createFlux({ context: { href: '/' } });
  const app = React.createElement(App, { flux });
  const index = React.createElement(Index, {
    flux,
    markup: ReactDOM.renderToString(app),
  });
  callback(null, `<!DOCTYPE html>${ReactDOM.renderToStaticMarkup(index)}`);
}

export default render;
