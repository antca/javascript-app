async function renderApp(context) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          html, body {
            margin: 0;
          }
        </style>
      </head>
      <body>
        <script src="/public/client.js"></script>
      </body>
    </html>
  `;
  return { html };
}

export default renderApp;
