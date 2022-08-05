<script lang="ts" setup>
import { computed, ref } from 'vue';

import { googleLogin } from '@/api/Auth';
import GoogleIcon from '@/assets/icons/google.svg';

import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';

const showLogin = ref(false);

const authSwitchText = computed(() => (showLogin.value ? "S'inscrire" : 'Se connecter'));

const connectWithGoogle = async () => {
  await googleLogin();
};
</script>

<template>
  <div class="authContainer">
    <LoginForm v-if="showLogin" />
    <RegisterForm v-else />
    <el-button link type="primary" @click="showLogin = !showLogin">{{ authSwitchText }}</el-button>
    <div class="socials">
      <el-button :icon="GoogleIcon" @click="connectWithGoogle">Connexion avec Google</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.authContainer {
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
