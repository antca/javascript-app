import React from 'react';

function Index({ markup, data }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <title>{'JavaScript App'}</title>
        {module.hot ? null : <link rel='stylesheet' href='public/client.css' />}
      </head>
      <body>
        <div id='app' dangerouslySetInnerHTML={{ __html: markup }} />
        <script dangerouslySetInnerHTML={{ __html: `
            window.__REACT_RESOLVER_PAYLOAD__ = ${JSON.stringify(data)}
        `}}>
        </script>
        <script src='public/client.js'></script>
      </body>
    </html>
  );
}

export default Index;
