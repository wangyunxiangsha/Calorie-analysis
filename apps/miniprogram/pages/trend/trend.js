const { request } = require('../../utils/request');
const { ensureLogin } = require('../../utils/auth');
const { ensureProfileReady } = require('../../utils/profile');

Page({
  data: {
    days: 7,
    trend: null,
    trendBars: [],
    trendSummary: '',
    loading: true,
  },

  async onShow() {
    await ensureLogin();
    const profile = await ensureProfileReady();
    if (!profile) return;
    this.loadTrend();
  },

  async loadTrend() {
    this.setData({ loading: true });
    try {
      const trend = await request({
        url: `/food-logs/weekly-trend?days=${this.data.days}`,
      });
      const maxCal = Math.max(
        trend.targets.calories || 1,
        ...trend.series.map((d) => d.calories),
        1,
      );
      const maxPro = Math.max(
        trend.targets.proteinG || 1,
        ...trend.series.map((d) => d.proteinG),
        1,
      );
      const trendBars = trend.series.map((d) => ({
        ...d,
        calPercent: Math.round((d.calories / maxCal) * 100),
        proPercent: Math.round((d.proteinG / maxPro) * 100),
        isToday: d.date === trend.endDate,
      }));
      let trendSummary = `近 ${trend.loggedDays} 天有记录 · 日均 ${trend.averages.calories} kcal、蛋白 ${trend.averages.proteinG}g`;
      const calRatio = trend.averages.calories / (trend.targets.calories || 1);
      if (trend.loggedDays > 0) {
        if (calRatio <= 1) {
          trendSummary += ` · 低于目标 ${trend.targets.calories} kcal`;
        } else if (calRatio <= 1.1) {
          trendSummary += ' · 接近热量目标';
        } else {
          trendSummary += ` · 高于目标约 ${Math.round((calRatio - 1) * 100)}%`;
        }
      }
      this.setData({ trend, trendBars, trendSummary, loading: false });
    } catch (e) {
      this.setData({ trend: null, trendBars: [], trendSummary: '', loading: false });
      wx.showToast({ title: e.message || '加载失败', icon: 'none' });
    }
  },

  onSetDays(e) {
    const days = Number(e.currentTarget.dataset.days);
    if (days === this.data.days) return;
    this.setData({ days });
    this.loadTrend();
  },

  onPullDownRefresh() {
    this.loadTrend().finally(() => wx.stopPullDownRefresh());
  },
});
