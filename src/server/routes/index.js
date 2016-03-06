import Router from 'koa-router';

const render = require('./render').default;
const api = require('./api').default;

const routes = new Router()
.use('/', render.routes())
.use('/api', api.routes());


if(module.hot) {
  module.hot.accept(['./render', './api'], () => {
    routes.stack = [];
    routes.use(require('./api').default.routes());
    routes.use(require('./render').default.routes());
  });
}


export default routes;
