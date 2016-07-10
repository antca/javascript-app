import Router from 'koa-router';
import renderApp from '../../renderApp';

const render = new Router()
.get('*', async (context) => {
  context.set('Content-Type', 'text/html');
  const stream = await renderApp(context);
  context.body = stream;
});

export default render;
