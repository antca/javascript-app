import counter from './counter';

function index() {
  return {
    modules: {
      counter: counter(),
    },
  };
}

export default index;
