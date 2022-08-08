<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { ref } from 'vue';

import { joinParty } from '@/api/parties';
import PopinContainer from '@/components/PopinContainer';
import { useUser } from '@/composables/useUser/index.js';

const props = defineProps({
  isDisplayed: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['update:isDisplayed']);

const computedIsDisplayed = computed({
  get: () => props.isDisplayed,
  set: (value) => {
    emits('update:isDisplayed', value);
  }
});

const { userData } = useUser();

const partyId = ref('');
const isLoading = ref(false);

const onSubmit = async () => {
  isLoading.value = true;

  await joinParty(partyId.value, {
    uid: userData.uid,
    isReady: false,
    isHost: false
  });

  isLoading.value = false;
  computedIsDisplayed.value = false;
};
</script>

<template>
  <PopinContainer v-if="computedIsDisplayed" @update:is-displayed="computedIsDisplayed = false">
    <div class="newPartyPopinContainer">
      <h2>Rejoindre une Secret Story</h2>
      <el-input v-model="partyId" placeholder="Identifiant" />
      <el-button type="primary" @click="onSubmit">Rejoindre</el-button>
    </div>
  </PopinContainer>
</template>

<style lang="scss" scoped>
.newPartyPopinContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 400px;
  width: 100vw;
}
</style>
