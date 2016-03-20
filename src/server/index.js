import path from 'path';
import http from 'http';

import Koa from 'koa';
import koaSend from 'koa-send';
import koaMount from 'koa-mount';
import { api, render } from './routes';

const app = new Koa();

if(__DEV__) {
  app.use(require('./middlewares/dev').default());
}

app
.use(koaMount('/', render))
.use(koaMount('/api', api))
.use(koaMount('/public/', async (ctx) => {
  await koaSend(ctx, ctx.path, { root: path.resolve(__dirname, 'public') });
}))
.listen(8080, function () {
  console.log(`Server started on port ${this.address().port} !`);
});
