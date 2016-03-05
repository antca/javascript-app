import React from 'react';

function Index({ flux, markup }) {
  return (
    <html lang='en'>
    <head>
      <meta charSet='UTF-8' />
      <title>Test</title>
    </head>
    <body>
      <div id='app' data-flux={flux} dangerouslySetInnerHTML={{ __html: markup }} />
      <script src='client.js'></script>
    </body>
    </html>
  );
}

export default Index;
