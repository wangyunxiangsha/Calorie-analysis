<template>
  <div>
    <div class="toolbar">
      <h2>食物库</h2>
      <div class="toolbar-right">
        <el-input
          v-model="q"
          placeholder="搜索"
          clearable
          style="width: 240px"
          @change="load"
        />
        <el-button type="primary" @click="openCreate">新增食物</el-button>
      </div>
    </div>
    <el-table :data="foods" v-loading="loading" stripe>
      <el-table-column prop="name" label="名称" min-width="140" />
      <el-table-column prop="category" label="分类" width="100" />
      <el-table-column prop="caloriesPer100g" label="热量/100g" width="110" />
      <el-table-column prop="proteinPer100g" label="蛋白/100g" width="100" />
      <el-table-column prop="defaultServingG" label="默认份量(g)" width="120" />
      <el-table-column prop="enabled" label="启用" width="80">
        <template #default="{ row }">
          <el-tag :type="row.enabled ? 'success' : 'info'">
            {{ row.enabled ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="editingId ? '编辑食物' : '新增食物'"
      width="520px"
      destroy-on-close
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="名称" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="分类">
          <el-input v-model="form.category" placeholder="如：主食、家常菜" />
        </el-form-item>
        <el-form-item label="别名">
          <el-input
            v-model="aliasesText"
            placeholder="逗号分隔，如：宽面汤,刀削"
          />
        </el-form-item>
        <el-form-item label="热量/100g" required>
          <el-input-number v-model="form.caloriesPer100g" :min="0" :precision="1" />
        </el-form-item>
        <el-form-item label="蛋白/100g" required>
          <el-input-number v-model="form.proteinPer100g" :min="0" :precision="1" />
        </el-form-item>
        <el-form-item label="碳水/100g" required>
          <el-input-number v-model="form.carbsPer100g" :min="0" :precision="1" />
        </el-form-item>
        <el-form-item label="脂肪/100g" required>
          <el-input-number v-model="form.fatPer100g" :min="0" :precision="1" />
        </el-form-item>
        <el-form-item label="默认份量(g)">
          <el-input-number v-model="form.defaultServingG" :min="1" />
        </el-form-item>
        <el-form-item label="份量单位">
          <el-input v-model="form.servingUnit" placeholder="碗、份" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="form.enabled" />
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
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import client from '../api/client';

type FoodRow = Record<string, unknown>;

const foods = ref<FoodRow[]>([]);
const loading = ref(false);
const saving = ref(false);
const q = ref('');
const dialogVisible = ref(false);
const editingId = ref<string | null>(null);
const aliasesText = ref('');

const emptyForm = () => ({
  name: '',
  category: '',
  caloriesPer100g: 100,
  proteinPer100g: 5,
  carbsPer100g: 15,
  fatPer100g: 3,
  defaultServingG: 200,
  servingUnit: '份',
  enabled: true,
});

const form = reactive(emptyForm());

async function load() {
  loading.value = true;
  try {
    foods.value = (await client.get('/admin/foods', {
      params: { q: q.value || undefined },
    })) as FoodRow[];
  } finally {
    loading.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  Object.assign(form, emptyForm());
  aliasesText.value = '';
  dialogVisible.value = true;
}

function openEdit(row: FoodRow) {
  editingId.value = String(row.id);
  Object.assign(form, {
    name: row.name,
    category: row.category || '',
    caloriesPer100g: Number(row.caloriesPer100g),
    proteinPer100g: Number(row.proteinPer100g),
    carbsPer100g: Number(row.carbsPer100g),
    fatPer100g: Number(row.fatPer100g),
    defaultServingG: Number(row.defaultServingG) || 200,
    servingUnit: row.servingUnit || '份',
    enabled: row.enabled !== false,
  });
  const aliases = row.aliases as string[] | undefined;
  aliasesText.value = Array.isArray(aliases) ? aliases.join('，') : '';
  dialogVisible.value = true;
}

function parseAliases() {
  return aliasesText.value
    .split(/[,，]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

async function save() {
  if (!form.name.trim()) {
    ElMessage.warning('请填写名称');
    return;
  }
  saving.value = true;
  const payload = {
    ...form,
    aliases: parseAliases(),
  };
  try {
    if (editingId.value) {
      await client.patch(`/admin/foods/${editingId.value}`, payload);
      ElMessage.success('已更新');
    } else {
      await client.post('/admin/foods', payload);
      ElMessage.success('已创建');
    }
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
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.toolbar-right {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
