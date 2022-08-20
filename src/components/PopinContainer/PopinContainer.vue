<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';

const emits = defineEmits(['update:isDisplayed']);

onMounted(() => {
  const doc = document.querySelector('body');
  if (doc) doc.style.overflow = 'hidden';
});

onUnmounted(() => {
  const doc = document.querySelector('body');
  if (doc) doc.style.overflow = '';
});
</script>

<template>
  <div class="popinRoot">
    <div class="backdrop" @click="emits('update:isDisplayed', false)"></div>
    <div class="popinContainer" v-bind="$attrs">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.popinRoot {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px !important;
}
.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: -1;
}
.popinContainer {
  max-height: 100%;
  overflow: auto;
  padding: 40px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  border: solid 1px #e6e6e6;
  width: 100%;
  max-width: 600px;
}
</style>
