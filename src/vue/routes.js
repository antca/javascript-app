import Home from './components/Home';
import Counter from './components/Counter';

function createRoutes() {
  return [
    { path: '/', component: Home },
    { path: '/counter', component: Counter },
  ];
}

export default createRoutes;
