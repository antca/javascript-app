import React from 'react';
import ReactDOM from 'react-dom/server';
import Router from 'koa-router';
import { prepare } from 'react-nexus';

import createFlux from '../../../nexus/createFlux';
import App from '../../../components/App';
import Index from '../../../components/Index';

const render = new Router()
.get('/', async (ctx) => {
  const flux = createFlux(ctx);
  const app = React.createElement(App, { flux });
  await prepare(app);
  const index = React.createElement(Index, {
    ctx,
    flux,
    markup: ReactDOM.renderToString(app),
  });
  ctx.body = `<!DOCTYPE html>${ReactDOM.renderToStaticMarkup(index)}`;
});

export default render;
