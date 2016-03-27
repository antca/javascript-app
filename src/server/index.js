import path from 'path';
import http from 'http';

import Koa from 'koa';
import koaSend from 'koa-send';
import koaMount from 'koa-mount';
import { api, render } from './routes';
import renderStaticSite from './renderStaticSite';

if(!process.argv[1].match(/webpack$/)) {
  const app = new Koa();

  if(module.hot) {
    module.hot.status((status) => {
      if(status === 'abort') {
        process.exit(0);
      }
    });
    app.use(require('./middlewares/dev').default());
  }

  app
  .use(koaMount('/api', api))
  .use(koaMount('/public', async (ctx) => {
    await koaSend(ctx, ctx.path, { root: path.resolve(__dirname, 'public') });
  }))
  .use(render)
  .listen(8080, function () {
    console.log(`Server started on port ${this.address().port}!`);
  });
}

export default renderStaticSite;
