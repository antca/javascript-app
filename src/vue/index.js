import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import App from './components/App';
import indexModule from './modules';

function createVue(state) {
  const store = new Vuex.Store(indexModule());
  if(state) {
    store.replaceState(state);
  }
  return new Vue({ ...App, store });
}

export default createVue;
