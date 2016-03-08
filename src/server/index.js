import path from 'path';

import Koa from 'koa';
import koaSend from 'koa-send';
import koaMount from 'koa-mount';

import routes from './routes';

const app = new Koa();

if(__DEV__) {
  app.use(require('./middlewares/dev').default());
}

app.use(koaMount('/public/', async (ctx) => {
  await koaSend(ctx, ctx.path, { root: path.resolve(__dirname, 'public') });
}))
.use(routes.middleware())
.listen(8080, function () {
  console.log(`Server started on port ${this.address().port}.`);
});
