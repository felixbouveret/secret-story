import { createRouter, createWebHistory } from 'vue-router';

import { useUser } from '@/composables/useUser';

import routes from './routes';

const { isLoggedIn } = useUser();

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'Auth' && !isLoggedIn.value) next({ name: 'Auth' });
  if (to.name === 'Auth' && isLoggedIn.value) next({ name: 'Home' });
  else next();
});

export default router;
