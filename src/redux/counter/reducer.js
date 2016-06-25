function reducer(state = 0, { type, payload }) {
  return ({
    INCREMENT() {
      return state + 1;
    },
    DECREMENT() {
      return state - 1;
    },
    SET(value) {
      return value;
    },
  }[type] || (() => state))(payload);
}

export default reducer;
