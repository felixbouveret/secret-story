<script lang="ts" setup>
import { useRouter } from 'vue-router';

import Navigation from './components/Navigation';
const { currentRoute } = useRouter();
</script>

<template>
  <div>
    <router-view />
    <navigation v-if="currentRoute.name !== 'Auth'" />
  </div>
</template>

<style scoped></style>
