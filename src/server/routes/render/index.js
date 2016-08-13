import Router from 'koa-router';
import renderApp from '../../renderApp';

const render = new Router()
.get('*', async (context) => {
  context.set('Content-Type', 'text/html');
  const { stream, redirect } = await renderApp(context);
  if(redirect) {
    return context.redirect(redirect);
  }
  context.body = stream;
});

export default render;
