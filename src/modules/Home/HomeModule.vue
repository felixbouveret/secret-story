<script lang="ts" setup>
import { onUnmounted, ref } from 'vue';

import { listenParties } from '@/api/parties';
import { getUser } from '@/api/users';
import { useUser } from '@/composables/useUser';

import JoinPartyPopin from './components/JoinPartyPopin.vue';
import NewPartyPopin from './components/NewPartyPopin.vue';
import PartiesList from './components/PartiesList.vue';

const isNewPopinDisplayed = ref(false);
const isJoinPopinDisplayed = ref(false);
const { userData } = useUser();
const userParties = ref();

const unsub = listenParties(userData.uid, async (parties) => {
  const formattedParties = await Promise.all(
    parties.map(async (party) => {
      const members = await Promise.all(party.membersUid.map(getUser));

      return {
        ...party,
        members
      };
    })
  );

  userParties.value = formattedParties;
});

onUnmounted(() => {
  unsub();
});
</script>

<template>
  <div class="homeRoot">
    <h1>Home</h1>
    <PartiesList :parties="userParties" />
    <div class="buttonsContainer">
      <el-button class="button" @click="isNewPopinDisplayed = true"
        >Créer une Secret Story</el-button
      >
      <el-button class="button" @click="isJoinPopinDisplayed = true">
        Rejoindre une Secret Story
      </el-button>
    </div>
    <NewPartyPopin
      :is-displayed="isNewPopinDisplayed"
      @update:is-displayed="isNewPopinDisplayed = false"
    />
    <JoinPartyPopin
      :is-displayed="isJoinPopinDisplayed"
      @update:is-displayed="isJoinPopinDisplayed = false"
    />
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
}
.button {
}
</style>
