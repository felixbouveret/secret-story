<script lang="ts" setup>
import { computed } from '@vue/reactivity';

import { useUser } from '@/composables/useUser';

import { usePartyPage } from '../composbles/usePartyPage';

const { partyData } = usePartyPage();
const { userData } = useUser();

const hasUserGuessed = computed(() => {
  const currentUser = partyData.members.find(({ uid }) => uid === userData.uid);
  return currentUser?.guessed;
});
</script>

<template>
  <div v-if="partyData.anecdotesToAnwser?.length && !hasUserGuessed" class="anecdotes">
    <p v-for="(item, index) in partyData.anecdotesToAnwser" :key="index">{{ item }}</p>
  </div>
  <div v-else-if="hasUserGuessed" class="guessed">
    <el-alert
      class="alert"
      title="BRAVO TU AS TROUVÉ !!! TU ES LE MEILLEUR DU GROUPE ET MON PRÉFÉRÉ"
      type="success"
      center
      show-icon
      :closable="false"
    />
    <p class="subtext">Ne le dis pas aux autres hein ;)</p>
  </div>
</template>

<style lang="scss" scoped>
.anecdotes {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
}

.guessed {
  text-align: center;

  .subtext {
    margin-top: 8px;
    color: #999;
  }
}
</style>
