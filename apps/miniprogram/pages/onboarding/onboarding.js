const { request } = require('../../utils/request');
const { ensureLogin } = require('../../utils/auth');
const { HEALTH_MODES, ACTIVITY_LEVELS } = require('../../utils/constants');

Page({
  data: {
    gender: 1,
    age: '28',
    heightCm: '170',
    weightKg: '65',
    activityIndex: 1,
    activityLabels: ACTIVITY_LEVELS.map((a) => a.label),
    healthMode: 'lose_fat',
    modes: HEALTH_MODES,
    submitting: false,
  },

  async onLoad(options) {
    this.isEdit = options.edit === '1';
    await ensureLogin();
    const isEdit = this.isEdit;
    try {
      const profile = await request({ url: '/users/me' });
      if (profile.weightKg != null && !isEdit) {
        wx.switchTab({ url: '/pages/index/index' });
        return;
      }
      const actIdx = ACTIVITY_LEVELS.findIndex(
        (a) => a.id === (profile.activityLevel || 'light'),
      );
      this.setData({
        gender: profile.gender ?? 1,
        age: String(profile.age ?? 28),
        heightCm: profile.heightCm ? String(profile.heightCm) : '170',
        weightKg: profile.weightKg ? String(profile.weightKg) : '65',
        activityIndex: actIdx >= 0 ? actIdx : 1,
        healthMode: profile.healthMode || 'lose_fat',
      });
    } catch (e) {
      console.warn(e);
    }
  },

  onGender(e) {
    this.setData({ gender: Number(e.detail.value) });
  },
  onAge(e) {
    this.setData({ age: e.detail.value });
  },
  onHeight(e) {
    this.setData({ heightCm: e.detail.value });
  },
  onWeight(e) {
    this.setData({ weightKg: e.detail.value });
  },
  onActivity(e) {
    this.setData({ activityIndex: Number(e.detail.value) });
  },
  onPickMode(e) {
    this.setData({ healthMode: e.currentTarget.dataset.id });
  },

  async onSubmit() {
    const { age, heightCm, weightKg, gender, activityIndex, healthMode } = this.data;
    if (!age || !heightCm || !weightKg) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });
    try {
      await request({
        url: '/users/me',
        method: 'PATCH',
        data: {
          gender,
          age: Number(age),
          heightCm: Number(heightCm),
          weightKg: Number(weightKg),
          activityLevel: ACTIVITY_LEVELS[activityIndex].id,
          healthMode,
          recalculateGoals: true,
        },
      });
      if (this.isEdit) {
        wx.navigateBack();
      } else {
        wx.switchTab({ url: '/pages/index/index' });
      }
    } catch (e) {
      wx.showToast({ title: e.message || '保存失败', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  },
});
