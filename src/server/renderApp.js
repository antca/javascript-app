async function renderApp(context) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <script src="/public/client.js"></script>
      </body>
    </html>
  `;
  return { html };
}

export default renderApp;
