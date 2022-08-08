<script lang="ts" setup>
import { computed } from '@vue/reactivity';
import { ref } from 'vue';

import { createParty } from '@/api/parties';
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

const name = ref('');
const startingDate = ref();
const isLoading = ref(false);

const onSubmit = async () => {
  isLoading.value = true;
  const party = {
    id: '',
    name: name.value,
    ownerUid: userData.uid,
    membersUid: [userData.uid],
    startingDate: startingDate.value
  };
  const owner = {
    uid: userData.uid,
    isReady: false,
    isHost: true
  };
  await createParty(party, owner);
  isLoading.value = false;
  computedIsDisplayed.value = false;
};
</script>

<template>
  <PopinContainer v-if="computedIsDisplayed" @update:is-displayed="computedIsDisplayed = false">
    <div class="newPartyPopinContainer">
      <h2>Votre Secret Story</h2>
      <form @submit.prevent="onSubmit">
        <el-input id="name" v-model="name" placeholder="Son nom" type="name" />
        <el-date-picker
          v-model="startingDate"
          style="width: 100% !important"
          type="date"
          placeholder="Date de début"
        />
        <el-button native-type="submit" type="primary">Créer</el-button>
      </form>
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

.datePicker {
  width: 100% !important;
}
</style>
