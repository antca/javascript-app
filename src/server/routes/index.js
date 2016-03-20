import koaCompose from 'koa-compose';

function createMiddleware(router) {
  return koaCompose([router.routes(), router.allowedMethods()]);
}

function createHotRouter(acceptUpdates, getRouter) {
  let middleware = createMiddleware(getRouter());
  if(module.hot) {
    acceptUpdates(() => {
      middleware = createMiddleware(getRouter());
    });
  }
  return (...args) => middleware(...args);
}

const api = createHotRouter(
  (callback) => module.hot.accept('../routes/api', callback),
  () => require('../routes/api').default
);

const render = createHotRouter(
  (callback) => module.hot.accept('../routes/render', callback),
  () => require('../routes/render').default
);

export { api, render };
