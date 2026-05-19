const { request } = require('../../utils/request');
const { ensureLogin } = require('../../utils/auth');
const { HEALTH_MODES, modeLabel } = require('../../utils/constants');

Page({
  data: {
    profile: null,
    modeLabel: '',
    modeLabels: HEALTH_MODES.map((m) => m.label),
    genderText: '',
  },

  async onShow() {
    await ensureLogin();
    this.loadProfile();
  },

  async loadProfile() {
    const profile = await request({ url: '/users/me' });
    const genderMap = { 1: '男', 2: '女' };
    this.setData({
      profile,
      modeLabel: modeLabel(profile.healthMode),
      genderText: genderMap[profile.gender] || '未设置',
    });
  },

  goEdit() {
    wx.navigateTo({ url: '/pages/onboarding/onboarding?edit=1' });
  },

  async onModeChange(e) {
    const mode = HEALTH_MODES[e.detail.value];
    try {
      await request({
        url: '/users/me',
        method: 'PATCH',
        data: { healthMode: mode.id, recalculateGoals: true },
      });
      wx.showToast({ title: '已切换' });
      this.loadProfile();
    } catch (err) {
      wx.showToast({ title: err.message || '失败', icon: 'none' });
    }
  },
});
