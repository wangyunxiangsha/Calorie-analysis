const { request } = require('../../utils/request');
const { pollRecognitionTask } = require('../../utils/recognition-poll');

const RECOGNITION_STORAGE_KEY = 'recognition_result';
const SEARCH_PREFILL_KEY = 'record_search_prefill';
const { ensureLogin } = require('../../utils/auth');
const { ensureProfileReady } = require('../../utils/profile');

const RECENT_KEY = 'recent_foods';
const BATCH_STORAGE_KEY = 'batch_confirm_items';
const MAX_RECENT = 8;

function toSelectPayload(food) {
  return {
    id: food.id,
    name: food.name,
    category: food.category,
    defaultServingG: Number(food.defaultServingG) || 200,
    servingUnit: food.servingUnit,
    caloriesPer100g: Number(food.caloriesPer100g) || 0,
    proteinPer100g: Number(food.proteinPer100g) || 0,
    carbsPer100g: Number(food.carbsPer100g) || 0,
    fatPer100g: Number(food.fatPer100g) || 0,
    servingG: Number(food.defaultServingG) || 200,
  };
}

Page({
  data: {
    keyword: '',
    foods: [],
    searched: false,
    recentFoods: [],
    multiMode: true,
    selected: {},
    selectedCount: 0,
  },

  async onShow() {
    await ensureLogin();
    const profile = await ensureProfileReady();
    if (!profile) return;
    const prefill = wx.getStorageSync(SEARCH_PREFILL_KEY);
    if (prefill) {
      wx.removeStorageSync(SEARCH_PREFILL_KEY);
      this.setData({ keyword: prefill });
      await this.doSearch();
    } else if (!this.data.keyword) {
      this.loadDefaultFoods();
    } else {
      this.applyFoodFlags(this.data.foods);
    }
    this.loadRecent();
  },

  loadRecent() {
    const recent = wx.getStorageSync(RECENT_KEY) || [];
    const { selected } = this.data;
    const recentFoods = recent.map((f) => ({
      ...f,
      checked: !!selected[f.id],
    }));
    this.setData({ recentFoods });
  },

  saveRecent(food) {
    let recent = wx.getStorageSync(RECENT_KEY) || [];
    recent = recent.filter((f) => f.id !== food.id);
    recent.unshift({
      id: food.id,
      name: food.name,
      defaultServingG: food.defaultServingG,
    });
    recent = recent.slice(0, MAX_RECENT);
    wx.setStorageSync(RECENT_KEY, recent);
    this.loadRecent();
  },

  applyFoodFlags(foods) {
    const { selected } = this.data;
    this.setData({
      foods: foods.map((f) => ({ ...f, checked: !!selected[f.id] })),
    });
  },

  async loadDefaultFoods() {
    const foods = await request({ url: '/foods?limit=30' });
    this.setData({ searched: false });
    this.applyFoodFlags(foods);
  },

  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ keyword });
    if (this._searchTimer) clearTimeout(this._searchTimer);
    this._searchTimer = setTimeout(() => this.doSearch(), 300);
  },

  async doSearch() {
    const q = this.data.keyword.trim();
    if (!q) {
      this.loadDefaultFoods();
      return;
    }
    try {
      const foods = await request({ url: `/foods?q=${encodeURIComponent(q)}&limit=30` });
      this.setData({ searched: true });
      this.applyFoodFlags(foods);
    } catch (e) {
      wx.showToast({ title: e.message || '搜索失败', icon: 'none' });
    }
  },

  onSetMode(e) {
    const multiMode = e.currentTarget.dataset.multi === '1';
    if (multiMode === this.data.multiMode) return;
    this.setData({ multiMode, selected: {}, selectedCount: 0 });
    this.applyFoodFlags(this.data.foods);
    this.loadRecent();
  },

  findFood(id) {
    return (
      this.data.foods.find((f) => f.id === id) ||
      this.data.recentFoods.find((f) => f.id === id)
    );
  },

  goConfirm(foodId, source, servingG) {
    const qs = [
      `foodId=${foodId}`,
      `source=${source}`,
      servingG ? `servingG=${servingG}` : '',
    ]
      .filter(Boolean)
      .join('&');
    wx.navigateTo({ url: `/pages/confirm/confirm?${qs}` });
  },

  async ensureFoodDetail(food) {
    if (food.caloriesPer100g != null) return food;
    try {
      return await request({ url: `/foods/${food.id}` });
    } catch {
      return food;
    }
  },

  async toggleSelect(food) {
    const selected = { ...this.data.selected };
    if (selected[food.id]) {
      delete selected[food.id];
    } else {
      const full = await this.ensureFoodDetail(food);
      selected[food.id] = toSelectPayload(full);
    }
    const selectedCount = Object.keys(selected).length;
    this.setData({ selected, selectedCount });
    this.applyFoodFlags(this.data.foods);
    this.loadRecent();
  },

  goBatchConfirm() {
    const items = Object.values(this.data.selected);
    if (!items.length) {
      wx.showToast({ title: '请先选择食物', icon: 'none' });
      return;
    }
    items.forEach((f) => this.saveRecent(f));
    wx.setStorageSync(BATCH_STORAGE_KEY, items);
    wx.navigateTo({ url: '/pages/batch-confirm/batch-confirm?source=manual' });
  },

  onClearSelected() {
    this.setData({ selected: {}, selectedCount: 0 });
    this.applyFoodFlags(this.data.foods);
    this.loadRecent();
  },

  async onPickFood(e) {
    const id = e.currentTarget.dataset.id;
    const food = this.findFood(id);
    if (!food) return;

    if (this.data.multiMode) {
      await this.toggleSelect(food);
      return;
    }

    this.saveRecent(food);
    this.goConfirm(id, 'manual', food.defaultServingG);
  },

  onPhoto() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera', 'album'],
      sizeType: ['compressed'],
      success: (res) => {
        const file = res.tempFiles[0];
        this.compressAndAnalyze(file.tempFilePath, file.fileType || 'image');
      },
    });
  },

  compressAndAnalyze(tempPath, fileType) {
    wx.compressImage({
      src: tempPath,
      quality: 65,
      success: (res) => this.analyzePhotoFile(res.tempFilePath, fileType),
      fail: () => this.analyzePhotoFile(tempPath, fileType),
    });
  },

  analyzePhotoFile(tempPath, fileType) {
    const mimeMap = {
      image: 'image/jpeg',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
    };
    const ext = (tempPath.split('.').pop() || 'jpg').toLowerCase();
    const mimeType = mimeMap[fileType] || mimeMap[ext] || 'image/jpeg';

    wx.showLoading({ title: 'AI 识别中…', mask: true });
    wx.getFileSystemManager().readFile({
      filePath: tempPath,
      encoding: 'base64',
      success: async (fileRes) => {
        try {
          const { taskId } = await request({
            url: '/recognition/analyze',
            method: 'POST',
            timeout: 60000,
            data: {
              imageBase64: fileRes.data,
              mimeType,
            },
          });

          const result = await pollRecognitionTask(taskId, {
            onProgress(elapsedMs) {
              const sec = Math.max(1, Math.round(elapsedMs / 1000));
              const hint =
                sec >= 60 ? '（大模型较慢，请稍候）' : '';
              wx.showLoading({
                title: `AI 识别中 ${sec}s${hint}`,
                mask: true,
              });
            },
          });

          wx.hideLoading();
          if (!result.candidates?.length) {
            wx.showModal({
              title: '未识别到菜品',
              content: '请换一张更清晰的照片，或手动搜索食物名称',
              showCancel: false,
            });
            return;
          }
          wx.setStorageSync(RECOGNITION_STORAGE_KEY, {
            taskId: result.taskId,
            candidates: result.candidates,
            needsManualPick: result.needsManualPick,
            provider: result.provider,
          });
          wx.navigateTo({ url: '/pages/recognition-result/recognition-result' });
        } catch (e) {
          wx.hideLoading();
          wx.showToast({ title: e.message || '识别失败', icon: 'none', duration: 3000 });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '读取图片失败', icon: 'none' });
      },
    });
  },
});
