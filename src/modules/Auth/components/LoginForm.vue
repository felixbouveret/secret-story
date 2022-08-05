<script lang="ts" setup>
import { ref } from 'vue';

import { useUser } from '@/composables/useUser';
import router from '@/router';

import AuthContainer from './AuthContainer.vue';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const { login } = useUser();

const onSubmit = async () => {
  isLoading.value = true;
  try {
    await login(email.value, password.value);
    router.push({ name: 'Home' });
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <AuthContainer title="Connexion" class="loginContainer">
    <el-input id="email" v-model="email" placeholder="Email" type="email" />
    <el-input
      id="password"
      v-model="password"
      placeholder="Mot de passe"
      type="password"
      show-password
    />
    <el-button type="primary" :loading="isLoading" @click="onSubmit">Se connecter</el-button>
  </AuthContainer>
</template>

<style lang="scss"></style>
