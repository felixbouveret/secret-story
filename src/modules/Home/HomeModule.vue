<script lang="ts" setup>
import { useUser } from '@/composables/useUser/index.js';
import router from '@/router';

const { logout } = useUser();
const onLogout = async () => {
  await logout();
  router.push({ name: 'Auth' });
};
</script>

<template>
  <div>
    <h1>Home</h1>
    <el-button type="danger" @click="onLogout"> Deconnexion </el-button>
  </div>
</template>

<style lang="scss" scoped></style>
