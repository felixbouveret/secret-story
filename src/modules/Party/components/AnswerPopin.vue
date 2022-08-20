<script lang="ts" setup>
import 'vue3-carousel/dist/carousel.css';

import { UserFilled } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { computed, ref } from 'vue';
import { Carousel, Slide } from 'vue3-carousel';

import { makeAGuess } from '@/api/parties';
import PopinContainer from '@/components/PopinContainer';
import { useUser } from '@/composables/useUser';

import { usePartyPage } from '../composbles/usePartyPage';

const props = defineProps({
  isDisplayed: {
    type: Boolean,
    default: false
  },
  ownerUid: {
    type: String,
    default: ''
  },
  partyId: {
    type: String,
    default: ''
  }
});

const emits = defineEmits(['update:isDisplayed']);

const { partyData } = usePartyPage();
const { userData } = useUser();

const computedIsDisplayed = computed({
  get: () => props.isDisplayed,
  set: (value) => {
    emits('update:isDisplayed', value);
  }
});

const isLoading = ref(false);
const anecdoteOwnerIndex = ref(0);
const ancdoteOwner = computed(() => ({
  uid: partyData.members[anecdoteOwnerIndex.value].uid,
  displayName: partyData.members[anecdoteOwnerIndex.value].displayName
}));
const deceitAnecdote = ref('');

const isDisabled = computed(() => !!(!ancdoteOwner.value.uid && !deceitAnecdote.value));

const onSubmit = async () => {
  isLoading.value = true;
  const payload = {
    partyId: partyData.party.id,
    guesserUid: userData.uid,
    anecdotesOwnerUid: ancdoteOwner.value.uid,
    anecdote: deceitAnecdote.value
  };

  const response = await makeAGuess(payload);
  if (response.isCorrect) onSuccess();
  else if (response.isTooEarly) onTooEarly();
  else onError();
  isLoading.value = false;
};

const onSuccess = () => {
  ElMessageBox.alert(
    "Tu es vraiment le•a meilleur•e d'entre nous tous•tes et je t'aime <3 Tu peux maintenant te lever et foutre une baffe à la personne dont tu as trouvé l'anecdote fausse ^^",
    'BRAVO TU AS TROUVÉ•E',
    {
      confirmButtonText: 'Merci je suis content•e',
      callback: () => {
        computedIsDisplayed.value = false;
      }
    }
  );
};

const onError = () => {
  ElMessage.error("Mauvaise réponse, t'es à chier, reviens dans une heure.");
  computedIsDisplayed.value = false;
};
const onTooEarly = () => {
  ElMessage.error("Tu ne peux faire qu'une réponse par heure");
  computedIsDisplayed.value = false;
};
</script>

<template>
  <PopinContainer
    v-if="computedIsDisplayed"
    style="padding: 40px 0"
    @update:is-displayed="computedIsDisplayed = false"
  >
    <div class="anecdotesPopinContainer">
      <h2>Votre anecdotes</h2>
      <p>De quel joueur viennent ces anecdotes ?</p>
      <carousel
        v-if="partyData.anecdotesToAnwser"
        v-model="anecdoteOwnerIndex"
        class="members"
        :items-to-show="2"
        snap-align="center"
        wrap-around
        touch-drag
      >
        <slide v-for="(member, index) in partyData.members" :key="index" class="itemContainer">
          <div class="item" :class="{ isSelected: anecdoteOwnerIndex === index }">
            <el-avatar
              class="member"
              :size="64"
              :src="member.photoUrl"
              @error="() => !member.photoUrl"
              @click="ancdoteOwner = member"
            >
              <UserFilled :width="32" />
            </el-avatar>
            <p>{{ member.displayName }}</p>
          </div>
        </slide>
      </carousel>
      <div class="anecdotesContainer">
        <p>Quelle anecdotes est la fausse ?</p>
        <div class="anecdotes">
          <div
            v-for="(item, index) in partyData.anecdotesToAnwser"
            :key="index"
            class="anecdote"
            :class="{ isSelected: deceitAnecdote === item }"
            @click="deceitAnecdote = item"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <el-button
        native-type="submit"
        type="primary"
        :loading="isLoading"
        :disabled="isDisabled"
        @click="onSubmit"
      >
        Envoyer
      </el-button>
    </div>
  </PopinContainer>
</template>

<style lang="scss" scoped>
.anecdotesPopinContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  h2 {
    @include title;
  }
}

.members {
  width: 100%;
  gap: 24px;
  margin: 0 -20px;
}

.itemContainer {
  padding: 12px;
}

.item {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  border-radius: 4px;
  gap: 8px;
  width: 100%;
  height: 100%;
}

.item,
.anecdote {
  border: solid 2px #ebebeb;
  box-shadow: 0 0 0 0 rgba(#00bcd4, 0.2);
  transition-property: border-color box-shadow;
  transition-duration: 0.3s;
  transition-timing-function: ease;
}

.anecdotesContainer {
  padding: 0 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.anecdotes {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
}

.anecdote {
  margin: 0;
  width: 100%;
  font-size: 16px;
  padding: 16px 8px;
  text-align: center;
  border-radius: 4px;
}

.isSelected {
  border: solid 2px #00bcd4;
  box-shadow: 0 0 0 4px rgba(#00bcd4, 0.2);
}
</style>
