import { createRenderer } from 'vue-server-renderer';
import combineStreams from 'combine-streams';

import createVue from '../vue';

const { renderToStream } = createRenderer();

async function renderApp(context) {
  const app = createVue({ location: context.url });
  return combineStreams()
  .append(`
    <!DOCTYPE html>
    <html>
      <head>
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
}

export default renderApp;
