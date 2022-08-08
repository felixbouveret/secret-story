import AuthPage from '@/modules/Auth';
import HomePage from '@/modules/Home';
import PartyPage from '@/modules/Party';

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
  },
  {
    path: '/party/:id',
    name: 'Party',
    component: PartyPage
  }
];
