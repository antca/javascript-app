import Router from 'koa-router';
import renderApp from '../../renderApp';

const render = new Router()
.get('*', async (context) => {
  context.body = await renderApp(context, true);
});

export default render;
