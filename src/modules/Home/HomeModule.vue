<script lang="ts" setup></script>

<template>
  <div class="homeRoot">
    <h1>Home</h1>
    <div class="buttonsContainer">
      <button class="button">Créer une Secret Story</button>
      <button class="button">Rejoindre une Secret Story</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.homeRoot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 80px 20px;
}
.buttonsContainer {
  max-width: 400px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 24px;
}
.button {
  cursor: pointer;
  width: 100%;
  text-align: center;
  padding: 20px;
  border: solid 1px #e6e6e6;
  border-radius: 8px;
}
</style>
