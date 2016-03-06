import React from 'react';

function Index({ title, flux, markup, cssPath, jsPath }) {
  return (
    <html lang='en'>
    <head>
      <meta charSet='UTF-8' />
      <title>{title}</title>
      {cssPath ? <link rel='stylesheet' href={cssPath} /> : null}
    </head>
    <body>
      <div id='app' data-flux={flux} dangerouslySetInnerHTML={{ __html: markup }} />
      <script src={jsPath}></script>
    </body>
    </html>
  );
}

export default Index;
