import 'element-plus/dist/index.css';
import './styles/_main.scss';

import ElementPlus from 'element-plus';
import { createApp } from 'vue';

import Auth from './api/Auth';
import App from './App.vue';
import { useUser } from './composables/useUser';
import router from './router';

const { fillUserData } = useUser();

Auth.authState((user) => {
  if (user) fillUserData(user);
});

createApp(App).use(router).use(ElementPlus).mount('#app');
