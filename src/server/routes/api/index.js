import Router from 'koa-router';

const api = new Router()
.get('/welcome', async (ctx) => ctx.body = {
  message: `Welcome to the API ! The server time is: ${new Date().toString()}.`,
});

export default api;
