import React from 'react';

function Index({ markup }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <title>{'JavaScript App'}</title>
        {module.hot ? null : <link rel='stylesheet' href='public/client.css' />}
      </head>
      <body>
        <div id='app' dangerouslySetInnerHTML={{ __html: markup }} />
        <script src='public/client.js'></script>
      </body>
    </html>
  );
}

export default Index;
