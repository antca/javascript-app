import path from 'path';
import http from 'http';

import Koa from 'koa';
import koaSend from 'koa-send';
import koaMount from 'koa-mount';
import koaCompose from 'koa-compose';

function createMiddleware(router) {
  return koaCompose([router.routes(), router.allowedMethods()]);
}

let apiMiddleware = createMiddleware(require('./routes/api').default);
let renderMiddleware = createMiddleware(require('./routes/render').default);

async function render(...args) {
  return renderMiddleware(...args);
}

async function api(...args) {
  return apiMiddleware(...args);
}

const app = new Koa();

if(__DEV__) {
  app.use(require('./middlewares/dev').default());
  if(module.hot) {
    module.hot.accept(['./routes/api', './routes/render'], () => {
      apiMiddleware = createMiddleware(require('./routes/api').default);
      renderMiddleware = createMiddleware(require('./routes/render').default);
    });
  }
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
