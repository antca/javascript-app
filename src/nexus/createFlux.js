import _ from 'lodash';

import { Flux, Store } from 'react-nexus';

class GenericStore extends Store {
  constructor(route, fetchHandler) {
    super(route, {});
    [
      'loadState',
      'dumpState',
      'readFromState',
      'fetch',
      'observe',
    ].map((methodName) => delete this[methodName]);
    this.fetchHandler = fetchHandler;
    this.data = new Map();
  }

  _findOrCreatePathData(path) {
    if(this.data.has(path)) {
      return this.data.get(path);
    }
    const pathData = {
      observers: new Set(),
      state: Store.State.resolve(),
    };
    this.data.set(path, pathData);
    return pathData;
  }

  _set(path, state) {
    const pathData = this._findOrCreatePathData(path);
    pathData.state = state;
    pathData.observers.forEach((notify) => notify(state));
    return state;
  }

  loadState(state) {
    this.data = new Map();
    _.map(state, (value, key) => this._set(key, Store.State.create(value)));
  }
  dumpState() {
    return _.fromPairs(Array.from(this.data.entries()).map(([key, value]) => [key, value.state.dump()]));
  }
  readFromState(query) {
    const path = this.toPath(query);
    return this._findOrCreatePathData(path).state;
  }
  async fetch(query = {}) {
    if(!this.fetchHandler) {
      return this.readFromState(query);
    }
    const path = this.toPath(query);
    const pathData = this._findOrCreatePathData(path);
    this._set(path, Store.State.pending(
      pathData.state.value
    ));
    try {
      return this._set(path, Store.State.resolve(
        await this.fetchHandler(query),
      ));
    }
    catch(error) {
      return this._set(path, Store.State.reject(
        pathData.state.value,
        error.message,
      ));
    }
  }

  get(query = {}) {
    return this.readFromState(query).value;
  }

  set(...args) {
    const { query = {}, value } = args.length < 2 ? { value: args[0] } : { query: args[0], value: args[1] };
    const path = this.toPath(query);
    this._set(path, Store.State.resolve(value));
    return this;
  }


  observe(query = {}, notify) {
    const path = this.toPath(query);
    const pathData = this._findOrCreatePathData(path);
    pathData.observers.add(notify);
    return () => {
      pathData.observers.delete(notify);
    };
  }
}



function createFlux({ context, window }) {
  const store = GenericStore.create('/myStore', async () => 'Hello');
  const reddit = GenericStore.create('/reddit/:reddit', async ({ reddit }) => (await fetch(`http://crossorigin.me/http://reddit.com/r/${reddit}.json`)).json());
  const simpleStore = GenericStore.create('/simple').set('just a value');
  return Flux.create({
    stores: [store, reddit, simpleStore],
  });
}

export default createFlux;
