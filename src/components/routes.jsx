import React from 'react';
import { Route, NotFoundRoute } from 'react-router';

import App from './App';
import Counter from './Counter';

const routes = (
  <Route path='/' component={App}>
    <Route path='/counter' component={Counter} />
  </Route>
);

export default routes;
