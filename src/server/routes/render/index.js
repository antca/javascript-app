import Router from 'koa-router';
import renderApp from '../../renderApp';

const render = new Router()
.get('*', async (context) => {
  const { notFound, redirectLocation, page } = await renderApp(context);
  if(notFound) {
    return context.throw(404);
  }
  if(redirectLocation) {
    return context.redirect(redirectLocation.pathname + redirectLocation.search);
  }
  context.body = page;
});

export default render;
