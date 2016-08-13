import Home from './components/Home';
import Counter from './components/Counter';

function createRoutes() {
  return [
    { name: 'Home', path: '/home', component: Home },
    { name: 'Counter', path: '/counter', component: Counter },
    { path: '/', redirect: '/home' },
  ];
}

export default createRoutes;
