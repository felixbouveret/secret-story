<script lang="ts" setup>
import { UserFilled } from '@element-plus/icons-vue';

import { usePartyPage } from '../composbles/usePartyPage.js';

const { partyData } = usePartyPage();
</script>

<template>
  <ul class="list">
    <li v-for="(member, index) in partyData.members" :key="index" class="item">
      <el-avatar
        :class="{ isOwner: member.isOwner }"
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
