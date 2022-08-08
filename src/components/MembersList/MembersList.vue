<script lang="ts" setup>
import { UserFilled } from '@element-plus/icons-vue';
import { onMounted, PropType, ref, watch } from 'vue';

import { getUser } from '@/api/users/users.js';

const props = defineProps({
  membersUid: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  ownerUid: {
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
  members.value = await Promise.all(props.membersUid.map(getUser));
  isLoading.value = false;
});

watch(props.membersUid, async (newList) => {
  members.value = await Promise.all(newList.map(getUser));
});
</script>

<template>
  <ul v-if="!isLoading" class="list" :class="{ isSmall }">
    <li v-for="(member, index) in members" :key="index">
      <el-tooltip :content="member.displayName">
        <el-avatar
          :class="{ isOwner: member.uid === ownerUid }"
          :size="isSmall ? 24 : 32"
          :src="member.photoUrl"
          @error="() => !member.photoUrl"
        >
          <UserFilled :width="isSmall ? 12 : 16" />
        </el-avatar>
      </el-tooltip>
    </li>
  </ul>
  <el-skeleton
    v-else
    class="list"
    :class="{ isSmall }"
    :style="`--el-skeleton-circle-size: ${isSmall ? 24 : 32}px`"
    animated
  >
    <template #template>
      <el-skeleton-item v-for="_ in skeletonNumber" :key="_" variant="circle" />
    </template>
  </el-skeleton>
</template>

<style lang="scss" scoped>
.list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  span {
    display: flex;
  }
}

.isSmall {
  gap: 4px;
}

.isOwner {
  border: solid 2px #d4af37;
}
</style>
