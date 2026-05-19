const { request } = require('../../utils/request');
const { ensureLogin } = require('../../utils/auth');
const { MEAL_TYPES, defaultMealType } = require('../../utils/constants');
const { calcNutrients } = require('../../utils/nutrition');

const STEP = 10;

Page({
  data: {
    food: null,
    foodId: '',
    source: 'manual',
    mealType: 'lunch',
    meals: MEAL_TYPES,
    servingG: 200,
    preview: { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 },
    submitting: false,
    taskId: '',
  },

  async onLoad(options) {
    await ensureLogin();
    const foodId = options.foodId;
    if (!foodId) {
      wx.navigateBack();
      return;
    }

    const food = await request({ url: `/foods/${foodId}` });
    const servingG = Number(options.servingG) || Number(food.defaultServingG) || 200;

    this.setData({
      food,
      foodId,
      source: options.source || 'manual',
      mealType: options.mealType || defaultMealType(),
      servingG,
      taskId: options.taskId || '',
    });
    this.updatePreview();
  },

  updatePreview() {
    const preview = calcNutrients(this.data.food, this.data.servingG);
    this.setData({ preview });
  },

  onMeal(e) {
    this.setData({ mealType: e.currentTarget.dataset.id });
  },

  onServingMinus() {
    const servingG = Math.max(10, this.data.servingG - STEP);
    this.setData({ servingG });
    this.updatePreview();
  },

  onServingPlus() {
    this.setData({ servingG: this.data.servingG + STEP });
    this.updatePreview();
  },

  async onConfirm() {
    this.setData({ submitting: true });
    try {
      await request({
        url: '/food-logs',
        method: 'POST',
        data: {
          foodId: this.data.foodId,
          mealType: this.data.mealType,
          source: this.data.source,
          servingG: this.data.servingG,
        },
      });
      if (this.data.taskId) {
        request({
          url: `/recognition/tasks/${this.data.taskId}/confirm`,
          method: 'PATCH',
          data: { foodId: this.data.foodId },
        }).catch(() => {});
      }
      wx.showToast({ title: '已记录', icon: 'success' });
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' });
      }, 400);
    } catch (e) {
      wx.showToast({ title: e.message || '记录失败', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  },
});
