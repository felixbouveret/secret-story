<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { computed, ref } from 'vue';

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
const ancdoteOwner = ref({
  uid: '',
  displayName: ''
});
const deceitAnecdote = ref('');

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
  ElMessage.error("Mauvaise réponse,t'es à chier");
};
</script>

<template>
  <PopinContainer v-if="computedIsDisplayed" @update:is-displayed="computedIsDisplayed = false">
    <div class="anecdotesPopinContainer">
      <h2>Votre anecdotes</h2>
      <p>De quel joueur viennent ces anecdotes ?</p>
      <span>{{ ancdoteOwner.displayName }}</span>
      <div v-if="partyData.anecdotesToAnwser" class="members">
        <el-avatar
          v-for="(member, index) in partyData.members"
          :key="index"
          :class="{ member, isSelected: member.uid === ancdoteOwner.uid }"
          :size="32"
          :src="member.photoUrl"
          @error="() => !member.photoUrl"
          @click="ancdoteOwner = member"
        >
          <UserFilled :width="16" />
        </el-avatar>
      </div>
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
      <el-button native-type="submit" type="primary" :loading="isLoading" @click="onSubmit">
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

.inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
}

.members {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.member img {
  cursor: pointer;
  border: 2px solid transparent;
}

.isSelected {
  border: 2px solid #f5222d;
  display: block;
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
  border: 1px solid #d9d9d9;
  &.isSelected {
    border: 2px solid #f5222d;
    display: block;
  }
}
</style>
