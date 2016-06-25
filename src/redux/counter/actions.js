function increment() {
  return {
    type: 'INCREMENT',
  };
}

function decrement() {
  return {
    type: 'DECREMENT',
  };
}

function set(value) {
  return {
    type: 'SET',
    payload: value,
  };
}

export {
  increment,
  decrement,
  set,
};
