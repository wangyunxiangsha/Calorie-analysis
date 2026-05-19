<template>
  <div>
    <h2>识别反馈</h2>
    <p class="hint">用户上报的识别名称与备注，最近 100 条</p>
    <el-table :data="rows" v-loading="loading" stripe>
      <el-table-column prop="createdAt" label="时间" width="170">
        <template #default="{ row }">
          {{ formatTime(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="reportedName" label="上报名称" min-width="140" />
      <el-table-column prop="taskId" label="任务 ID" min-width="200" show-overflow-tooltip />
      <el-table-column prop="suggestedFoodId" label="建议食物 ID" width="200" show-overflow-tooltip />
      <el-table-column prop="note" label="备注" min-width="160" show-overflow-tooltip />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import client from '../api/client';

type FeedbackRow = {
  id: string;
  taskId: string | null;
  reportedName: string;
  suggestedFoodId: string | null;
  note: string | null;
  createdAt: string;
};

const rows = ref<FeedbackRow[]>([]);
const loading = ref(false);

async function load() {
  loading.value = true;
  try {
    rows.value = (await client.get('/admin/recognition-feedback')) as FeedbackRow[];
  } finally {
    loading.value = false;
  }
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('zh-CN');
}

onMounted(load);
</script>

<style scoped>
.hint {
  color: #666;
  font-size: 13px;
  margin: 0 0 12px;
}
</style>
