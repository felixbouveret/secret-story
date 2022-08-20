<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { addHours, format, isBefore } from 'date-fns';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { startParty } from '@/api/parties';
import { useDate } from '@/composables/useDate';
import { useUser } from '@/composables/useUser';

import AnecdotesList from './components/AnecdotesList.vue';
import AnecdotesPopin from './components/AnecdotesPopin.vue';
import AnswerPopin from './components/AnswerPopin.vue';
import MembersCards from './components/MembersCards.vue';
import { usePartyPage } from './composbles/usePartyPage';

const { formatDateSeconds, getTime } = useDate();
const { partyData, triggerPartyListen, triggerPartyMembersListen, resetPartyData } = usePartyPage();
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
const isOwner = computed(() => partyData.members.find(({ uid }) => uid === userData.uid)?.isHost);
const currentUser = computed(() => partyData.members.find(({ uid }) => uid === userData.uid));
const hasUserGuessed = computed(() => currentUser.value?.guessed);
const userLastGuessDate = computed(() => {
  if (!currentUser.value?.lastGuessDate) return null;
  const date = new Date(currentUser.value?.lastGuessDate.seconds * 1000);
  return format(addHours(date, 1), 'HH:mm');
});

const cantGuess = computed(() => {
  if (!currentUser.value?.lastGuessDate || currentUser.value?.lastGuessDate === undefined)
    return false;
  const date = addHours(new Date(currentUser.value?.lastGuessDate.seconds * 1000), 1);
  return isBefore(new Date(), date);
});

onMounted(() => {
  resetPartyData();
});

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
            <span>Début : </span>
            <span>{{ formatDateSeconds(partyData.party.startingDate.seconds) }}</span>
          </p>
        </div>
        <AnecdotesList />
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
            :disabled="!areMembersReady && partyData.members?.length"
            type="warning"
            @click="onPartyStart"
          >
            Lancer la partie
          </el-button>
          <div v-if="partyData.party.isStarted && !hasUserGuessed">
            <el-button
              :loading="isLoading"
              :disabled="cantGuess"
              type="success"
              @click="answerPopinDisplayed = true"
            >
              Proposer une réponse
            </el-button>
            <p v-if="partyData.party.isStarted && userLastGuessDate" class="nextGuess">
              <span>Prochain guess :</span>
              <span>{{ userLastGuessDate }}</span>
            </p>
          </div>
        </div>
        <template v-if="!partyData.party.isStarted">
          <el-alert
            v-if="partyData.members?.length < 1"
            class="alert"
            title="La partie doit avoir plus d'un membre"
            type="info"
            center
            show-icon
            :closable="false"
          />
          <el-alert
            v-else-if="!areMembersReady"
            class="alert"
            title="Tous les utilisateurs doivent être prêts pour lancer la partie"
            type="info"
            center
            show-icon
            :closable="false"
          />
          <el-alert
            v-else
            class="alert"
            title="La partie peut commencer"
            type="success"
            center
            show-icon
            :closable="false"
          />
        </template>

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
  padding: 80px 20px 100px;
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
  text-align: center;
}

.buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.nextGuess {
  font-size: 16px;
  text-align: center;
  margin-top: 8px;
}

.infos {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.alert {
  width: 100%;
  text-align: center;

  @media screen and (min-width: 768px) {
    width: auto;
    text-align: left;
  }
}

.dates {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
</style>
