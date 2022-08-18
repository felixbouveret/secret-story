<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';

import { addAnecdotes } from '@/api/parties';
import PopinContainer from '@/components/PopinContainer';
import { useUser } from '@/composables/useUser';

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

const computedIsDisplayed = computed({
  get: () => props.isDisplayed,
  set: (value) => {
    emits('update:isDisplayed', value);
  }
});

const { userData } = useUser();

const firstAnecdote = reactive({
  content: '',
  isDeceit: false
});
const secondAnecdote = reactive({
  content: '',
  isDeceit: false
});
const deceitAnecdote = reactive({
  content: '',
  isDeceit: true
});

const isLoading = ref(false);

const onSubmit = async () => {
  isLoading.value = true;

  await addAnecdotes(props.partyId, userData.uid, [firstAnecdote, secondAnecdote, deceitAnecdote]);

  isLoading.value = false;
  computedIsDisplayed.value = false;
};
</script>

<template>
  <PopinContainer v-if="computedIsDisplayed" @update:is-displayed="computedIsDisplayed = false">
    <div class="anecdotesPopinContainer">
      <h2>Votre anecdotes</h2>
      <form class="inner" @submit.prevent="onSubmit">
        <el-input v-model="firstAnecdote.content" type="sucess" placeholder="Anecdote vraie" />
        <el-input v-model="secondAnecdote.content" type="sucess" placeholder="Anecdote vraie" />
        <el-input v-model="deceitAnecdote.content" type="danger" placeholder="Anecdote fausse" />

        <el-button native-type="submit" type="primary">Envoyer</el-button>
      </form>
    </div>
  </PopinContainer>
</template>

<style lang="scss" scoped>
.anecdotesPopinContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
}

.inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
}
</style>
