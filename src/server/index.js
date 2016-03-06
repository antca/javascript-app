import path from 'path';

import Koa from 'koa';
import koaSend from 'koa-send';

const routes = require('./routes').default;

const app = new Koa();

let allRoutes = routes.routes();

if(__DEV__) {
  app.use(require('./middlewares/dev').default());
  if(module.hot) {
    module.hot.accept('./routes', () => {
      allRoutes = require('./routes').default.routes();
    });
  }
}

app
.use(async (ctx, next) => allRoutes(ctx, next))
.use(async (ctx) => {
  await koaSend(ctx, ctx.path, { root: path.resolve(__dirname, 'public') });
})
.listen(8080, function () {
  console.log(`Server started on port ${this.address().port}.`)
});
