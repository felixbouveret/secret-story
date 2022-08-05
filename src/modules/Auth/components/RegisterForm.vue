<script lang="ts" setup>
import { ref } from 'vue';

import { register } from '@/api/Auth';

import AuthContainer from './AuthContainer.vue';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);

const onSubmit = async () => {
  isLoading.value = true;
  try {
    const user = await register(email.value, password.value);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div>
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
      <el-button type="primary" :loading="isLoading" @click="onSubmit">Login</el-button>
    </AuthContainer>
  </div>
</template>

<style lang="scss"></style>
