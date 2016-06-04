import { observable } from 'mobx';

function createStore() {
  return observable({ hello: 'world' });
}

export default createStore;
