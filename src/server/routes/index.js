import Router from 'koa-router';

const render = require('./render').default;
const api = require('./api').default;

const routes = new Router()
.use('/', render.middleware())
.use('/api', api.middleware());


if(module.hot) {
  module.hot.accept(['./render', './api'], () => {
    routes.stack = [];
    routes.use(require('./api').default.middleware());
    routes.use(require('./render').default.middleware());
  });
}


export default routes;
