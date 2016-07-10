import Vue from 'vue';
import { createRenderer } from 'vue-server-renderer';
import combineStreams from 'combine-streams';

import App from '../components/App';

const { renderToStream } = createRenderer();

async function renderApp(context) {
  return combineStreams()
  .append(`
    <!DOCTYPE html>
    <html>
      <head>
        ${module.hot ? '': '<link rel="stylesheet" href="/public/client.css">'}
      </head>
      <body>
  `)
  .append(renderToStream(new Vue(App)))
  .append(`
        <script src="/public/client.js"></script>
      </body>
    </html>
  `)
  .append(null);
}

export default renderApp;
