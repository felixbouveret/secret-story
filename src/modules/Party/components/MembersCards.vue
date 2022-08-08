<script lang="ts" setup>
import { UserFilled } from '@element-plus/icons-vue';
import { onMounted, PropType, ref, watch } from 'vue';

import { getAllPartyMembers } from '@/api/parties';

const props = defineProps({
  membersUid: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  ownerUid: {
    type: String,
    default: ''
  },
  partyId: {
    type: String,
    default: ''
  },
  isSmall: {
    type: Boolean,
    default: false
  },
  skeletonNumber: {
    type: Number,
    default: 3
  }
});
const isLoading = ref(false);
const members = ref();

onMounted(async () => {
  isLoading.value = true;
  members.value = await getAllPartyMembers(props.partyId, props.membersUid);
  isLoading.value = false;
});

watch(props.membersUid, async (newList) => {
  members.value = await getAllPartyMembers(props.partyId, newList);
});
</script>

<template>
  <ul v-if="!isLoading" class="list">
    <li v-for="(member, index) in members" :key="index" class="item">
      <el-avatar
        :class="{ isOwner: member.uid === ownerUid }"
        :size="64"
        :src="member.photoUrl"
        @error="() => !member.photoUrl"
      >
        <UserFilled :width="32" />
      </el-avatar>
      <p>{{ member.displayName }}</p>
      <el-tag v-if="!member.isReady" type="warning">En attente de réponses</el-tag>
      <el-tag v-else type="success">Prêt</el-tag>
    </li>
  </ul>
  <el-skeleton v-else class="list" :style="`--el-skeleton-circle-size: ${32}px`" animated>
    <template #template>
      <el-skeleton-item v-for="_ in skeletonNumber" :key="_" variant="circle" />
    </template>
  </el-skeleton>
</template>

<style lang="scss" scoped>
.list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.item {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  border: solid 1px #ebebeb;
  border-radius: 4px;
  gap: 8px;
}
</style>
