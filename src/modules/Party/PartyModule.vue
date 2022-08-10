<script lang="ts" setup>
import { onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useDate } from '@/composables/useDate';

import AnecdotesPopin from './components/AnecdotesPopin.vue';
import MembersCards from './components/MembersCards.vue';
import { usePartyPage } from './composbles/usePartyPage';

const { formatDateSeconds } = useDate();
const { partyData, triggerPartyListen, triggerPartyMembersListen } = usePartyPage();
const route = useRoute();

const anecdotesPopinDisplayed = ref(false);

const unsubPartyListen = triggerPartyListen(route.params.id);
const unsubPartyMembersListen = triggerPartyMembersListen(route.params.id);

onUnmounted(() => {
  unsubPartyListen();
  unsubPartyMembersListen();
});
</script>

<template>
  <div class="partyRoot">
    <div v-if="partyData.party && partyData.party.name" class="inner">
      <h1 class="title">{{ partyData.party.name }}</h1>
      <div class="infos">
        <div class="dates">
          <p>
            <span>Début :</span>
            <span>{{ formatDateSeconds(partyData.party.startingDate.seconds) }}</span>
          </p>
        </div>
        <el-button type="success" @click="anecdotesPopinDisplayed = true"
          >Ajouter mes anecdotes</el-button
        >
        <div class="members">
          <MembersCards
            :members-uid="partyData.party.membersUid"
            :owner-uid="partyData.party.ownerUid"
            :party-id="route.params.id"
          />
        </div>
      </div>
    </div>
    <template v-else>
      <el-skeleton :rows="5" />
    </template>
    <AnecdotesPopin
      :is-displayed="anecdotesPopinDisplayed"
      :party-id="route.params.id"
      @update:is-displayed="anecdotesPopinDisplayed = false"
    />
  </div>
</template>

<style lang="scss" scoped>
.partyRoot {
  padding: 80px 20px;
}

.inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  @include bigTitle;
}

.infos {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.dates {
  display: flex;
  gap: 8px;
}
</style>
