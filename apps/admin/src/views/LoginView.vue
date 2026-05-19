<template>
  <div class="login-page">
    <el-card class="card">
      <h1>卡路里分析 · 管理后台</h1>
      <el-form @submit.prevent="onSubmit">
        <el-form-item label="账号">
          <el-input v-model="username" autocomplete="username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="password" type="password" show-password />
        </el-form-item>
        <el-button type="primary" native-type="submit" :loading="loading" block>
          登录
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import client from '../api/client';

const router = useRouter();
const username = ref('admin');
const password = ref('admin123');
const loading = ref(false);

async function onSubmit() {
  loading.value = true;
  try {
    const res = (await client.post('/admin/auth/login', {
      username: username.value,
      password: password.value,
    })) as { accessToken: string };
    localStorage.setItem('admin_token', res.accessToken);
    await router.push('/dashboard');
  } catch (e: unknown) {
    const err = e as { message?: string };
    ElMessage.error(err.message ?? '登录失败');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f4f8;
}
.card {
  width: 360px;
}
h1 {
  font-size: 18px;
  margin: 0 0 24px;
  text-align: center;
}
</style>
