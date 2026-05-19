<template>
  <div>
    <h2>数据概览</h2>
    <el-row :gutter="16" v-if="stats">
      <el-col :span="6">
        <el-statistic title="注册用户" :value="stats.userCount" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="食物条目" :value="stats.foodCount" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="总记录数" :value="stats.logCount" />
      </el-col>
      <el-col :span="6">
        <el-statistic title="今日记录" :value="stats.todayLogs" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import client from '../api/client';

type Stats = {
  userCount: number;
  foodCount: number;
  logCount: number;
  todayLogs: number;
};

const stats = ref<Stats | null>(null);

onMounted(async () => {
  stats.value = (await client.get('/admin/stats/overview')) as Stats;
});
</script>
