import { MemoryStore, HTTPStore, Action } from 'react-nexus';

function createModule(apiConfig) {
  const stores = [
    MemoryStore.create('/refreshCounter').set({}, 0),
    HTTPStore.create('/api/:endPoint', apiConfig),
  ];

  const actions = [
    Action.create('/refresh/:endPoint', async (flux, { endPoint }) => {
      const state = await flux.fetchStore(`/api/${endPoint}`);
      if(state.isRejected()) {
        console.error(state.reason);
      }
      else {
        const refreshCountStore = flux.store('/refreshCounter');
        refreshCountStore.set({}, refreshCountStore.readFromState({}).value + 1);
      }
    }),
  ];

  return { stores, actions };
}

export default createModule;
