import path from 'path';

import Koa from 'koa';
import koaSend from 'koa-send';

import routes from './routes';
import { devMiddleware, hotMiddleware } from './middlewares/webpack';

const app = new Koa();
app
.use(routes.routes());
if(process.env.NODE_ENV === 'development') {
  app.use(devMiddleware)
  .use(hotMiddleware);
  console.log('Webpack middleware mounted !');
}
app.use(async (ctx) => {
  await koaSend(ctx, ctx.path, { root: path.resolve(__dirname, 'public') });
})
.listen(8080, function () {
  console.log(`Server started on port ${this.address().port}.`)
});
