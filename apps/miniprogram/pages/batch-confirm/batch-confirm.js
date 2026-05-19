const { request } = require('../../utils/request');
const { calcNutrients } = require('../../utils/nutrition');

const STORAGE_KEY = 'batch_confirm_items';

Page({
  data: {
    items: [],
    mealType: 'lunch',
    meals: [
      { id: 'breakfast', label: '早餐' },
      { id: 'lunch', label: '午餐' },
      { id: 'dinner', label: '晚餐' },
      { id: 'snack', label: '加餐' },
    ],
    totalPreview: { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 },
    submitting: false,
    source: 'manual',
  },

  onLoad(options) {
    const raw = wx.getStorageSync(STORAGE_KEY);
    const list = Array.isArray(raw) ? raw : [];
    if (!list.length) {
      wx.showToast({ title: '未选择食物', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }
    const items = list.map((f) => ({
      ...f,
      servingG: Number(f.servingG) || Number(f.defaultServingG) || 200,
      preview: calcNutrients(f, Number(f.servingG) || Number(f.defaultServingG) || 200),
    }));
    this.setData({
      items,
      source: options.source || 'manual',
    });
    this.recalcTotal();
  },

  onUnload() {
    wx.removeStorageSync(STORAGE_KEY);
  },

  recalcTotal() {
    const total = { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 };
    const items = this.data.items.map((item) => {
      const preview = calcNutrients(item, item.servingG);
      total.calories += preview.calories;
      total.proteinG += preview.proteinG;
      total.carbsG += preview.carbsG;
      total.fatG += preview.fatG;
      return { ...item, preview };
    });
    this.setData({
      items,
      totalPreview: {
        calories: Math.round(total.calories * 10) / 10,
        proteinG: Math.round(total.proteinG * 10) / 10,
        carbsG: Math.round(total.carbsG * 10) / 10,
        fatG: Math.round(total.fatG * 10) / 10,
      },
    });
  },

  onMeal(e) {
    this.setData({ mealType: e.currentTarget.dataset.id });
  },

  onServingMinus(e) {
    const idx = Number(e.currentTarget.dataset.idx);
    const items = [...this.data.items];
    const step = 10;
    const min = 10;
    items[idx].servingG = Math.max(min, (items[idx].servingG || 200) - step);
    this.setData({ items });
    this.recalcTotal();
  },

  onServingPlus(e) {
    const idx = Number(e.currentTarget.dataset.idx);
    const items = [...this.data.items];
    const step = 10;
    items[idx].servingG = (items[idx].servingG || 200) + step;
    this.setData({ items });
    this.recalcTotal();
  },

  onRemove(e) {
    const idx = Number(e.currentTarget.dataset.idx);
    const items = this.data.items.filter((_, i) => i !== idx);
    if (!items.length) {
      wx.navigateBack();
      return;
    }
    this.setData({ items });
    this.recalcTotal();
  },

  async onConfirm() {
    if (this.data.submitting) return;
    const { items, mealType, source } = this.data;
    this.setData({ submitting: true });
    wx.showLoading({ title: '保存中…', mask: true });
    try {
      for (const item of items) {
        await request({
          url: '/food-logs',
          method: 'POST',
          data: {
            foodId: item.id,
            mealType,
            source: source || 'manual',
            servingG: item.servingG,
          },
        });
      }
      wx.hideLoading();
      wx.showToast({ title: `已记录 ${items.length} 项`, icon: 'success' });
      setTimeout(() => wx.switchTab({ url: '/pages/index/index' }), 600);
    } catch (err) {
      wx.hideLoading();
      wx.showToast({
        title: (err && err.message) || '保存失败',
        icon: 'none',
      });
      this.setData({ submitting: false });
    }
  },
});
