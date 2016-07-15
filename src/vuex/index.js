import Vue from 'vue';
import Vuex from 'vuex';

import createCounterStore from './counter';

Vue.use(Vuex);

function createStore() {
  return new Vuex.Store({
    modules: {
      counter: createCounterStore(),
    }
  })
}

export default createStore;
