<script lang="ts" setup>
import { ArrowRight, CircleClose, CopyDocument } from '@element-plus/icons-vue';
import { onUnmounted, ref } from 'vue';

import { deleteParty, leaveParty, listenParties } from '@/api/parties';
import { getUser } from '@/api/users';
import MembersList from '@/components/MembersList';
import { useUser } from '@/composables/useUser';
import router from '@/router';

import JoinPartyPopin from './components/JoinPartyPopin.vue';
import NewPartyPopin from './components/NewPartyPopin.vue';

const isNewPopinDisplayed = ref(false);
const isJoinPopinDisplayed = ref(false);
const { userData } = useUser();
const userParties = ref();

const copyId = (id: string) => {
  navigator.clipboard.writeText(id);
};

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

const onCross = (party: any) => {
  if (party.ownerUid === userData.uid) deleteParty(party.id);
  else leaveParty(party.id, userData.uid);
};

onUnmounted(() => {
  unsub();
});
</script>

<template>
  <div class="homeRoot">
    <h1 class="title">SLT la zone</h1>
    <!-- <PartiesList :parties="userParties" /> -->
    <div class="cardsContainer">
      <el-card v-for="(party, index) in userParties" :key="index" class="box-card">
        <template #header>
          <div class="card-header">
            <h2 class="cardTitle">{{ party.name }}</h2>
            <div style="display: flex; gap: 8px; align-items: center">
              <p>
                {{ party.id }}
              </p>
              <el-tooltip content="Copié !" trigger="click">
                <el-button
                  :icon="CopyDocument"
                  :plain="false"
                  size="small"
                  @click="copyId(party.id)"
                />
              </el-tooltip>
            </div>
          </div>
        </template>
        <MembersList :members-uid="party.membersUid" :owner-uid="party.ownerUid" is-small />
        <div class="cardButtons">
          <el-button
            :icon="CircleClose"
            :plain="false"
            type="danger"
            size="small"
            @click="onCross(party)"
          >
            {{ party.ownerUid === userData.uid ? 'Supprimer' : 'Quitter' }}
          </el-button>

          <el-button
            :icon="ArrowRight"
            :plain="false"
            size="small"
            @click="router.push({ name: 'Party', params: { id: party.id } })"
          >
            Entrer
          </el-button>
        </div>
      </el-card>
    </div>
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

.title {
  font-size: 24px;
}

.buttonsContainer {
  max-width: 400px;
}

.cardsContainer {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;

  @media screen and (min-width: 768px) {
    flex-direction: row;
    gap: 40px;
    justify-content: space-between;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.cardTitle {
  font-size: 18px;
  font-weight: bold;
}

.box-card {
  width: 100%;
}

.cardButtons {
  display: flex;
  margin-top: 16px;
  gap: 8px;
}

.buttonsContainer {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
