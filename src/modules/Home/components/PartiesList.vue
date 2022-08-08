<script lang="ts" setup>
import { ArrowRight, CircleClose, CopyDocument } from '@element-plus/icons-vue';

import { deleteParty, leaveParty } from '@/api/parties';
import MembersList from '@/components/MembersList';
import { useDate } from '@/composables/useDate.js';
import { useUser } from '@/composables/useUser/index.js';
import router from '@/router';

const { userData } = useUser();
const { formatDateSeconds } = useDate();

const props = defineProps({
  parties: {
    type: Array,
    default: () => []
  }
});

const formatDate = (_: unknown, __: unknown, cellValue: any) =>
  formatDateSeconds(cellValue.seconds);

const copyId = (id: string) => {
  navigator.clipboard.writeText(id);
};

const onCross = (row) => {
  if (row.ownerUid === userData.uid) deleteParty(row.id);
  else leaveParty(row.id, userData.uid);
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
            />
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="Nom" />
    <el-table-column label="Début" prop="startingDate" :formatter="formatDate" />
    <el-table-column label="Fin" prop="endingDate" :formatter="formatDate" />
    <el-table-column label="Membres" width="150px" load>
      <template #default="scope">
        <MembersList :members-uid="scope.row.membersUid" :owner-uid="scope.row.ownerUid" is-small />
      </template>
    </el-table-column>
    <el-table-column label="Actions">
      <template #default="scope">
        <el-tooltip :content="scope.row.ownerUid === userData.uid ? 'Supprimer' : 'Quitter'">
          <el-button
            :icon="CircleClose"
            :plain="false"
            type="danger"
            size="small"
            @click="onCross(scope.row)"
          />
        </el-tooltip>
        <el-button
          :icon="ArrowRight"
          :plain="false"
          size="small"
          @click="router.push({ name: 'Party', params: { id: scope.row.id } })"
        />
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
