import get from 'lodash-es/get';
import set from 'lodash-es/set';
import { computed, reactive, watch } from 'vue';

import AuthService from '@/api/Auth';
import { useStorage } from '@/composables/useStorage';

const { getFromLocalStorage, setInLocalStorage, removeFromLocalStorage } = useStorage();
interface UserInterface {
  uid?: string;
  email?: string;
  displayName?: string;
  photoUrl?: string;
}
const userData = reactive({
  uid: null,
  email: '',
  displayName: '',
  photoUrl: ''
});

const setUserData = (key: string, data: any) => set(userData, key, data);
const getUserData = (key: string) => get(userData, key);

const isLoggedIn = computed(() => !!userData.email);

const login = async (mail: string, password: string) => {
  const user = await AuthService.login(mail, password);
  fillUserData(user);
};

const logout = async () => {
  await AuthService.logout();
  resetUserData();
};

const register = async (email: string, password: string, displayName: string) => {
  const user = await AuthService.register(email, password, displayName);
  if (user) {
    fillUserData(user);
    persistUserData();
  }
  return user;
};

const resetUserData = async () => {
  for (const key in userData) delete userData[key];
  removeFromLocalStorage(['uid', 'email', 'displayName', 'photoUrl']);
};

const persistUserData = () => {
  setInLocalStorage('uid', userData.uid);
  setInLocalStorage('email', userData.email);
  setInLocalStorage('displayName', userData.displayName);
  setInLocalStorage('photoUrl', userData.photoUrl);
};

const fillUserData = (user) => {
  setUserData('uid', user.uid);
  setUserData('email', user.email);
  setUserData('displayName', user.displayName);
  setUserData('photoUrl', user.photoURL);
};

const fillUserDataFromSession = () => {
  const userLocal: UserInterface = {};
  userLocal.uid = getFromLocalStorage('uid');
  userLocal.email = getFromLocalStorage('email');
  userLocal.displayName = getFromLocalStorage('displayName');
  userLocal.photoUrl = getFromLocalStorage('photoUrl');
  Object.assign(userData, userLocal);
};

const localEmail = getFromLocalStorage('email');
if (localEmail) {
  fillUserDataFromSession();
}

watch(userData, (_) => {
  persistUserData();
});

export const useUser = () => ({
  isLoggedIn,
  getUserData,
  setUserData,
  persistUserData,
  resetUserData,
  fillUserData,
  logout,
  login,
  register,
  userData
});
