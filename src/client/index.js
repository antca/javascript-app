import createVue from '../vue';

createVue({ state: window.__VUEX_STATE__ }).$mount('#app');
