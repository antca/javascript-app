import React from 'react';
import ReactDOM from 'react-dom/server';
import Router from 'koa-router';
import { prepare } from 'react-nexus';

import { js2b64 } from '../../../util/b64';
import createFlux from '../../../nexus/createFlux';
import App from '../../../components/App';
import Index from '../../../components/Index';

const render = new Router()
.get('/', async (ctx) => {
  const flux = createFlux();
  const app = React.createElement(App, { flux });
  await prepare(app);
  const index = React.createElement(Index, {
    flux: js2b64(flux.dumpState()),
    markup: ReactDOM.renderToString(app),
    cssPath: __DEV__ ? null : 'public/client.css',
    jsPath: 'public/client.js',
    title: 'App title',
  });
  ctx.body = `<!DOCTYPE html>${ReactDOM.renderToStaticMarkup(index)}`;
});

export default render;
