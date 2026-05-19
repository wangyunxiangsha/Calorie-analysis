<template>
  <el-container class="layout">
    <el-aside width="200px">
      <div class="logo">Calorie Admin</div>
      <el-menu :default-active="route.path" router>
        <el-menu-item index="/dashboard">数据概览</el-menu-item>
        <el-menu-item index="/foods">食物库</el-menu-item>
        <el-menu-item index="/modes">模式配置</el-menu-item>
        <el-menu-item index="/recognition-feedback">识别反馈</el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <el-button link type="danger" @click="logout">退出</el-button>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

function logout() {
  localStorage.removeItem('admin_token');
  router.push('/login');
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
}
.logo {
  padding: 16px;
  font-weight: 600;
}
.el-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid #eee;
}
</style>
