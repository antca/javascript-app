import Vuex from 'vuex';

function createCounterModule() {
  return {
    state: {
      count: 0,
    },
    getters: {
      count(state) {
        return state.count;
      },
    },
    actions: {
      increment({ commit }) {
        commit('INCREMENT');
      },
      decrement({ commit }) {
        commit('DECREMENT');
      },
    },
    mutations: {
      INCREMENT(state) {
        state.count++;
      },
      DECREMENT(state) {
        state.count--;
      },
    },
  };
}

export default createCounterModule;
