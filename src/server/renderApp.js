import { createRenderer } from 'vue-server-renderer';
import combineStreams from 'combine-streams';

import createVue from '../vue';

const { renderToStream } = createRenderer();

async function renderApp(context) {
  const app = createVue({ location: context.url });
  const route = app.$route;
  if(route.redirectedFrom) {
    return { redirect: route.fullPath };
  }
  const stream = combineStreams()
  .append(`
    <!DOCTYPE html>
    <html>
      <head>
        <link rel="icon" href="data:;base64,iVBORw0KGgo=">
        ${module.hot ? '': '<link rel="stylesheet" href="/public/client.css">'}
      </head>
      <body>
  `)
  .append(renderToStream(app))
  .append(`
        <script>
          window.__VUEX_STATE__ = JSON.parse(
            decodeURIComponent(
              '${
                encodeURIComponent(
                  JSON.stringify(app.$store.state)
                )
              }'
            )
          );
        </script>
        <script src="/public/client.js"></script>
      </body>
    </html>
  `)
  .append(null);
  return { stream };
}

export default renderApp;
