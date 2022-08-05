<script lang="ts" setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
});
</script>

<template>
  <div class="authContainer">
    <h1 class="title">{{ props.title }}</h1>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.authContainer {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  border-radius: 8px;
  border: solid 1px #e6e6e6;
}

.title {
  @include title;
  text-align: center;
}
</style>
