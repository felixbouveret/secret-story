<script lang="ts" setup>
import { ref } from 'vue';

import { login } from '@/api/Auth';

import AuthContainer from './AuthContainer.vue';

const email = ref('');
const password = ref('');
const isLoading = ref(false);

const onSubmit = async () => {
  isLoading.value = true;
  try {
    const user = await login(email.value, password.value);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div>
    <AuthContainer title="Connexion" class="loginContainer">
      <el-input id="email" v-model="email" placeholder="Email" type="email" />
      <el-input
        id="password"
        v-model="password"
        placeholder="Mot de passe"
        type="password"
        show-password
      />
      <el-button type="primary" :loading="isLoading" @click="onSubmit">Login</el-button>
    </AuthContainer>
  </div>
</template>

<style lang="scss"></style>
