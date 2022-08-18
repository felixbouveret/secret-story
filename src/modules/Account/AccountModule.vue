<script lang="ts" setup>
import { reactive } from 'vue';

import { useUser } from '@/composables/useUser';

const { userData } = useUser();

const formData = reactive({
  displayName: userData.displayName,
  email: userData.email,
  photoUrl: userData.photoUrl
});
</script>

<template>
  <div class="accountRoot">
    <h1 class="title">Vla ton compte</h1>
    <div class="inner">
      <form>
        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="formData.email" type="email" class="form-control" />
        </div>
        <div class="form-group">
          <label for="name">Nom de scène</label>
          <input id="name" v-model="formData.displayName" type="text" class="form-control" />
        </div>
        <!-- <div class="form-group">
          <label for="photoUrl">Photo de profil</label>
          <img :src="formData.photoUrl" alt="" />
        </div> -->
        <button type="submit" class="btn btn-primary">Enregistrer</button>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.accountRoot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 80px 20px;
}

.title {
  font-size: 24px;
}
</style>
