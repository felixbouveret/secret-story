<script lang="ts" setup>
import { CopyDocument, StarFilled, UserFilled } from '@element-plus/icons-vue';
import { format } from 'date-fns';

const props = defineProps({
  parties: {
    type: Array,
    default: () => []
  }
});

const formatDate = (row, column, cellValue) =>
  format(new Date(cellValue.seconds * 1000), 'dd/MM/yyyy');

const copyId = (id: string) => {
  navigator.clipboard.writeText(id);
};
</script>

<template>
  <el-table :data="props.parties" style="width: 100%">
    <el-table-column prop="id" label="Identifiant">
      <template #default="scope">
        <div style="display: flex; gap: 8px; align-items: center">
          <p>
            {{ scope.row.id }}
          </p>
          <el-tooltip content="Copié !" trigger="click">
            <el-button
              :icon="CopyDocument"
              :plain="false"
              size="small"
              @click="copyId(scope.row.id)"
            ></el-button>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="Nom" />
    <el-table-column label="Début" prop="startingDate" :formatter="formatDate" />
    <el-table-column label="Fin" prop="endingDate" :formatter="formatDate" />
    <el-table-column label="Membres" width="150px" load>
      <template #default="scope">
        <div style="display: flex; gap: 4px; flex-wrap: wrap">
          <span v-for="(member, index) in scope.row.members" :key="index" class="member">
            <StarFilled
              v-if="scope.row.ownerUid === member.uid"
              class="owner"
              :size="8"
              color="#D4AF37"
            />
            <el-tooltip :content="member.displayName">
              <el-avatar :size="24" :src="member.photoUrl" @error="() => !member.photoUrl">
                <UserFilled width="16px" />
              </el-avatar>
            </el-tooltip>
          </span>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<style lang="scss" scoped>
.member {
  position: relative;
}
.owner {
  width: 16px;
  position: absolute;
  top: -2px;
  right: -4px;
  pointer-events: none;
}
</style>
