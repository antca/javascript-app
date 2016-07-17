function counter() {
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
        commit('increment');
      },
      decrement({ commit }) {
        commit('decrement');
      },
    },
    mutations: {
      increment(state) {
        state.count++;
      },
      decrement(state) {
        state.count--;
      },
    },
  };
}

export default counter;
