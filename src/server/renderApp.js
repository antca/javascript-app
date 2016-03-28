import React from 'react';
import ReactDOM from 'react-dom/server';
import { prepare } from 'react-nexus';

import App from '../components/App';
import Index from '../components/Index';

import createFlux from '../nexus/createFlux';

async function renderApp(context, prepareFlux = false) {
  const flux = createFlux({ context });
  const app = React.createElement(App, { flux });
  if(prepareFlux) {
    await prepare(app);
  }
  const index = React.createElement(Index, {
    fluxData: JSON.stringify(flux.dumpState()),
    markup: ReactDOM.renderToString(app),
  });
  return `<!DOCTYPE html>${ReactDOM.renderToStaticMarkup(index)}`;
}

export default renderApp;
