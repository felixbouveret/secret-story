import AuthPage from '@/modules/Auth';
import HomePage from '@/modules/Home';

export default [
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage
  },
  {
    path: '/',
    name: 'Home',
    component: HomePage
  }
];
