<script lang="ts" setup>
import { computed, ref } from 'vue';

import PopinContainer from '@/components/PopinContainer';

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

const computedIsDisplayed = computed({
  get: () => props.isDisplayed,
  set: (value) => {
    emits('update:isDisplayed', value);
  }
});

const isLoading = ref(false);
const test = ref('');

const onSubmit = async () => {
  isLoading.value = true;
  isLoading.value = false;
};
</script>

<template>
  <PopinContainer v-if="computedIsDisplayed" @update:is-displayed="computedIsDisplayed = false">
    <div class="anecdotesPopinContainer">
      <h2>Votre anecdotes</h2>
      <div v-if="partyData.anecdotesToAnwser" class="members">
        <el-avatar
          v-for="(member, index) in partyData.members"
          :key="index"
          :class="{ member, isSelected: member.uid === test }"
          :size="32"
          :src="member.photoUrl"
          @error="() => !member.photoUrl"
          @click="test = member.uid"
        >
          <UserFilled :width="16" />
        </el-avatar>
      </div>
      <div class="anecdotes">
        <el-button v-for="(item, index) in partyData.anecdotesToAnwser" :key="index">{{
          item
        }}</el-button>
      </div>
      <el-button native-type="submit" type="primary">Envoyer</el-button>
    </div>
  </PopinContainer>
</template>

<style lang="scss" scoped>
.anecdotesPopinContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
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
  gap: 8px;
}

.member img {
  cursor: pointer;
  border: 2px solid transparent;
}

.isSelected img {
  border: 2px solid #f5222d;
  display: block;
}

.anecdotes {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  button {
    margin: 0;
    width: 100%;
    font-size: 16px;
  }
}
</style>
