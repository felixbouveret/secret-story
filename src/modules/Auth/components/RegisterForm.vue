<script lang="ts" setup>
import { ref } from 'vue';

import { useUser } from '@/composables/useUser';
import router from '@/router';

import AuthContainer from './AuthContainer.vue';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);

const { register } = useUser();

const onSubmit = async () => {
  isLoading.value = true;
  try {
    await register(email.value, password.value);
    router.push({ name: 'Home' });
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <AuthContainer title="Inscription" class="loginContainer">
    <el-input id="email" v-model="email" placeholder="Email" type="email" />
    <el-input
      id="password"
      v-model="password"
      placeholder="Mot de passe"
      type="password"
      show-password
    />
    <el-input
      id="confirmPassword"
      v-model="confirmPassword"
      placeholder="Confirmation de mot de passe"
      type="password"
      show-password
    />
    <el-button type="primary" :loading="isLoading" @click="onSubmit">S'inscrire</el-button>
  </AuthContainer>
</template>

<style lang="scss"></style>
