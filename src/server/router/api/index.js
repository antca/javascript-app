import Router from 'koa-66';

const api = new Router()
.get('/welcome', async (ctx) => ctx.body = {
  message: `Welcome to the API! Server time: ${new Date().toString()}.`,
});

export default api;
