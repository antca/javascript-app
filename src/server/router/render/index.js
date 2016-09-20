import Router from 'koa-66';
import renderApp from '../../renderApp';

const render = new Router()
.get(async (context) => {
  context.set('Content-Type', 'text/html');
  const { html, redirect } = await renderApp(context);
  if(redirect) {
    return context.redirect(redirect);
  }
  context.body = html;
});

export default render;
