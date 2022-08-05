<script lang="ts" setup>
import { computed, ref } from 'vue';

import Auth from '@/api/Auth';
import GoogleIcon from '@/assets/icons/google.svg';
import router from '@/router';

import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';

const showLogin = ref(false);
const isLoading = ref(false);

const authSwitchText = computed(() =>
  showLogin.value ? "Je n'ai pas de compte" : "J'ai déjà un compte"
);

const connectWithGoogle = async () => {
  isLoading.value = true;
  try {
    await Auth.googleLogin();
    router.push({ name: 'Home' });
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="authRoot">
    <LoginForm v-if="showLogin" />
    <RegisterForm v-else />
    <el-button link type="primary" @click="showLogin = !showLogin">{{ authSwitchText }}</el-button>
    <div class="socials">
      <el-button :icon="GoogleIcon" :loading="isLoading" @click="connectWithGoogle"
        >S'identifier avec Google</el-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.authRoot {
  height: 100vh;
  min-height: 600px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.socials {
  border-top: 1px solid #e6e6e6;
  padding: 32px 0;
  margin: 0 32px;
  display: flex;
  justify-content: space-around;
}
</style>
