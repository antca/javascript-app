import Router from 'koa-66';

import api from './api';
import render from './render';

const router = new Router()
.mount('/api', api)
.mount('/', render);

export default router;
