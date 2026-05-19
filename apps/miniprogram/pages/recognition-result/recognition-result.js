const { request } = require('../../utils/request');

const STORAGE_KEY = 'recognition_result';

Page({
  data: {
    taskId: '',
    provider: '',
    needsManualPick: false,
    candidates: [],
    reporting: false,
  },

  onLoad() {
    const data = wx.getStorageSync(STORAGE_KEY);
    if (!data || !Array.isArray(data.candidates) || !data.candidates.length) {
      wx.showToast({ title: '无识别结果', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 600);
      return;
    }

    const candidates = data.candidates.map((c) => ({
      ...c,
      confidencePct: Math.round((c.confidence || 0) * 100),
      canConfirm: !!c.foodId,
      estimateText: c.llmEstimate?.calories
        ? `约 ${Math.round(c.llmEstimate.calories)} kcal`
        : '',
    }));

    this.setData({
      taskId: data.taskId || '',
      provider: data.provider || '',
      needsManualPick: !!data.needsManualPick,
      candidates,
    });
  },

  onUnload() {
    wx.removeStorageSync(STORAGE_KEY);
  },

  onPickCandidate(e) {
    const idx = Number(e.currentTarget.dataset.idx);
    const c = this.data.candidates[idx];
    if (!c) return;

    if (c.foodId) {
      const qs = [
        `foodId=${c.foodId}`,
        'source=photo',
        c.defaultServingG ? `servingG=${c.defaultServingG}` : '',
        this.data.taskId ? `taskId=${this.data.taskId}` : '',
      ]
        .filter(Boolean)
        .join('&');
      wx.navigateTo({ url: `/pages/confirm/confirm?${qs}` });
      return;
    }

    wx.setStorageSync('record_search_prefill', c.name);
    wx.showModal({
      title: '未匹配食物库',
      content: `将搜索「${c.name}」，请在列表中选择正确食物`,
      showCancel: false,
      success: () => wx.switchTab({ url: '/pages/record/record' }),
    });
  },

  onManualSearch() {
    wx.switchTab({ url: '/pages/record/record' });
  },

  onReportWrong() {
    const names = this.data.candidates.map((c) => c.name).join('、');
    wx.showModal({
      title: '识别有误',
      editable: true,
      placeholderText: '请填写实际菜名',
      content: `当前识别：${names}`,
      success: async (res) => {
        if (!res.confirm) return;
        const reportedName = (res.content || '').trim();
        if (!reportedName) {
          wx.showToast({ title: '请填写菜名', icon: 'none' });
          return;
        }
        this.setData({ reporting: true });
        try {
          await request({
            url: '/recognition/feedback',
            method: 'POST',
            data: {
              taskId: this.data.taskId || undefined,
              reportedName,
              note: '用户从小程序提交',
            },
          });
          wx.showToast({ title: '感谢反馈', icon: 'success' });
          wx.setStorageSync('record_search_prefill', reportedName);
          setTimeout(() => wx.switchTab({ url: '/pages/record/record' }), 500);
        } catch (e) {
          wx.showToast({ title: e.message || '提交失败', icon: 'none' });
        } finally {
          this.setData({ reporting: false });
        }
      },
    });
  },
});
