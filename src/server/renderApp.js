import React from 'react';
import ReactDOM from 'react-dom/server';

import App from '../components/App';
import Index from '../components/Index';

function renderApp(props) {
  const app = React.createElement(App, props);
  const index = React.createElement(Index, { markup: ReactDOM.renderToString(app) });
  return `<!DOCTYPE html>${ReactDOM.renderToStaticMarkup(index)}`;
}

export default renderApp;
