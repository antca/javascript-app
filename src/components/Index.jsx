import React from 'react';
import { js2b64 } from '../util/b64';

function Index({ ctx, flux, markup }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <title>{'JavaScript App'}</title>
        {module.hot ? null : <link rel='stylesheet' href='public/client.css' />}
      </head>
      <body>
        <div id='app' data-flux={flux ? js2b64(flux.dumpState()) : null} dangerouslySetInnerHTML={{ __html: markup }} />
        <script src='public/client.js'></script>
      </body>
    </html>
  );
}

export default Index;
