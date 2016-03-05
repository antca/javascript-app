import { MemoryStore, HTTPStore, Action } from 'react-nexus';

const stores = [
  MemoryStore.create('/test/refreshCount').set({}, 0),
  HTTPStore.create('/api/test', { protocol: 'http', hostname: 'localhost', port: 8080 }),
];

const actions = [
  Action.create('/test/refresh', async (flux) => {
    await flux.store('/api/test').fetch({});
    const refreshCountStore = flux.store('/test/refreshCount');
    refreshCountStore.set({}, refreshCountStore.get({}) + 1);
  }),
];

export { stores, actions };
