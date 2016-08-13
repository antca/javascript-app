import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';

Vue.use(Vuex);
Vue.use(VueRouter);

import App from './components/App';
import indexModule from './modules';
import routes from './routes';

function createVue({ state, location }) {
  const router = new VueRouter({
    mode: 'history',
    routes: routes(),
  });
  const store = new Vuex.Store(indexModule());
  const vue = new Vue({ ...App, store, router });
  if(state) {
    store.replaceState(state);
  }
  if(location) {
    router.replace(location);
  }
  return vue;
}

export default createVue;
