<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';

import { getParty } from '@/api/parties/parties.js';
import { getUser } from '@/api/users/users.js';
import MembersList from '@/components/MembersList';
import { useDate } from '@/composables/useDate';

const route = useRoute();
const { formatDateSeconds } = useDate();

const partyData = ref();
const members = ref();

onBeforeMount(async () => {
  partyData.value = await getParty(route.params.id as string);
  members.value = await Promise.all(partyData.value.membersUid.map(getUser));
});
</script>

<template>
  <div class="partyRoot">
    <div v-if="partyData && partyData.name" class="inner">
      <h1 class="title">{{ partyData.name }}</h1>
      <div class="infos">
        <div class="dates">
          <p>
            <span>Début :</span>
            <span>{{ formatDateSeconds(partyData.startingDate.seconds) }}</span>
          </p>
          <p>
            <span>Fin :</span>
            <span>{{ formatDateSeconds(partyData.endingDate.seconds) }}</span>
          </p>
        </div>
        <div class="members">
          <MembersList :members-uid="partyData.membersUid" :owner-uid="partyData.ownerUid" />
        </div>
      </div>
    </div>
    <template v-else>
      <el-skeleton :rows="5" />
    </template>
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
