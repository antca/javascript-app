import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router-next';

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
  if(location) {
    router.setInitialLocation(location);
  }
  const store = new Vuex.Store(indexModule());
  if(state) {
    store.replaceState(state);
  }
  return new Vue({ ...App, store, router });
}

export default createVue;
