<template>
  <div>
    <h2>健康模式配置</h2>
    <el-table :data="modes" stripe>
      <el-table-column prop="label" label="名称" width="120" />
      <el-table-column prop="healthMode" label="ID" width="140" />
      <el-table-column label="配置 JSON">
        <template #default="{ row }">
          <code>{{ JSON.stringify(row.config) }}</code>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="编辑模式配置" width="560px" destroy-on-close>
      <el-form label-width="100px">
        <el-form-item label="模式 ID">
          <el-input :model-value="editingMode" disabled />
        </el-form-item>
        <el-form-item label="显示名称">
          <el-input v-model="label" />
        </el-form-item>
        <el-form-item label="配置 JSON">
          <el-input
            v-model="configJson"
            type="textarea"
            :rows="12"
            placeholder="系数与阈值 JSON"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import client from '../api/client';

type ModeRow = {
  healthMode: string;
  label: string;
  config: Record<string, unknown>;
};

const modes = ref<ModeRow[]>([]);
const dialogVisible = ref(false);
const saving = ref(false);
const editingMode = ref('');
const label = ref('');
const configJson = ref('');

async function load() {
  modes.value = (await client.get('/admin/modes')) as ModeRow[];
}

function openEdit(row: ModeRow) {
  editingMode.value = row.healthMode;
  label.value = row.label;
  configJson.value = JSON.stringify(row.config, null, 2);
  dialogVisible.value = true;
}

async function save() {
  let config: Record<string, unknown>;
  try {
    config = JSON.parse(configJson.value) as Record<string, unknown>;
  } catch {
    ElMessage.error('JSON 格式不正确');
    return;
  }
  saving.value = true;
  try {
    await client.patch(`/admin/modes/${editingMode.value}`, {
      label: label.value,
      config,
    });
    ElMessage.success('已保存');
    dialogVisible.value = false;
    await load();
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '保存失败';
    ElMessage.error(msg);
  } finally {
    saving.value = false;
  }
}

onMounted(load);
</script>

<style scoped>
code {
  font-size: 12px;
}
</style>
