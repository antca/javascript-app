import Router from 'koa-router';

const api = new Router()
.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  return next();
})
.get('/test', async (ctx) => ctx.body = {
  message: `Welcome to the API ${+new Date()}`,
});

export default api;
