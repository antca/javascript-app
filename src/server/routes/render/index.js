import React from 'react';
import ReactDOM from 'react-dom/server';
import Router from 'koa-router';
import { prepare } from 'react-nexus';

import createFlux from '../../../nexus/createFlux';
import App from '../../../components/App';
import Index from '../../../components/Index';

const render = new Router()
.get('*', async (context) => {
  const flux = createFlux({ context });
  const app = React.createElement(App, { flux });
  await prepare(app);
  const index = React.createElement(Index, {
    flux,
    markup: ReactDOM.renderToString(app),
  });
  context.body = `<!DOCTYPE html>${ReactDOM.renderToStaticMarkup(index)}`;
});

export default render;
