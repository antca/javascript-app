import Router from 'koa-router';
import renderApp from '../../renderApp';

const render = new Router()
.get('*', async (context) => {
  context.body = renderApp();
});

export default render;
