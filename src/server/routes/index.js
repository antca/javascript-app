import Router from 'koa-router';

import render from './render';
import api from './api';

const routes = new Router()
.use('/', render.routes())
.use('/api', api.routes());

export default routes;
