<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { startParty } from '@/api/parties';
import { useDate } from '@/composables/useDate';
import { useUser } from '@/composables/useUser';

import AnecdotesPopin from './components/AnecdotesPopin.vue';
import AnswerPopin from './components/AnswerPopin.vue';
import MembersCards from './components/MembersCards.vue';
import { usePartyPage } from './composbles/usePartyPage';

const { formatDateSeconds } = useDate();
const { partyData, triggerPartyListen, triggerPartyMembersListen } = usePartyPage();
const { userData } = useUser();
const route = useRoute();
const isLoading = ref(false);

const anecdotesPopinDisplayed = ref(false);
const answerPopinDisplayed = ref(false);

const unsubPartyListen = triggerPartyListen(route.params.id);
const unsubPartyMembersListen = triggerPartyMembersListen(route.params.id);

const onPartyStart = async () => {
  isLoading.value = true;
  await startParty(partyData.party.id);
  isLoading.value = false;
};

const areMembersReady = computed(() => partyData.members.every((member) => member.isReady));
const isOwner = computed(() => partyData.members.find(({ uid }) => uid === userData.uid).isHost);

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
        <div v-if="partyData.anecdotesToAnwser?.length">
          <p v-for="(item, index) in partyData.anecdotesToAnwser" :key="index">{{ item }}</p>
        </div>
        <div class="buttons">
          <el-button
            v-if="!partyData.party.isStarted"
            type="success"
            @click="anecdotesPopinDisplayed = true"
          >
            Ajouter mes anecdotes
          </el-button>
          <el-button
            v-if="!partyData.party.isStarted && isOwner"
            :loading="isLoading"
            type="warning"
            @click="onPartyStart"
          >
            Lancer la partie
          </el-button>
          <el-button
            v-if="partyData.party.isStarted && !userData.guessed"
            :loading="isLoading"
            type="success"
            @click="answerPopinDisplayed = true"
          >
            Proposer une réponse
          </el-button>
        </div>
        <el-alert
          v-if="!areMembersReady"
          title="Tous les utilisateurs doivent être prêts pour lancer la partie"
          type="info"
          center
          show-icon
          :closable="false"
        />
        <el-alert
          v-else-if="!partyData.party.isStarted"
          title="La partie peut commencer"
          type="success"
          center
          show-icon
          :closable="false"
        />
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
    <AnswerPopin
      :is-displayed="answerPopinDisplayed"
      :party-id="route.params.id"
      @update:is-displayed="answerPopinDisplayed = false"
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

.buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
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
