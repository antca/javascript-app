import path from 'path';
import http from 'http';

import Koa from 'koa';
import koaMount from 'koa-mount';

import filesMiddleware from './middlewares/files';

let router = require('./router').default.routes();

const app = new Koa();

if(module.hot) {
  module.hot.status((status) => {
    if(status === 'abort') {
      process.exit(0);
    }
  });
  app.use(require('./middlewares/dev').default());
  module.hot.accept('./router', () => {
    router = require('./router').default.routes();
  });
}

app
.use(koaMount('/public', filesMiddleware(path.resolve(__dirname, 'public'))))
.use((...args) => router(...args))
.listen(8080, function () {
  console.log(`Server started on port ${this.address().port}!`);
});
