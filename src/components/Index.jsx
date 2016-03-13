import React from 'react';
import { js2b64 } from '../util/b64';

function Index({ ctx, flux, markup }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <title>{'React Nexus App'}</title>
        {__DEV__ ? null : <link rel='stylesheet' href={'public/client.css'} /> }
      </head>
      <body>
        <div id='app' data-flux={js2b64(flux.dumpState())} dangerouslySetInnerHTML={{ __html: markup }} />
        <script src={'public/client.js'}></script>
      </body>
    </html>
  );
}

export default Index;
