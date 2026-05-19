const { request } = require('../../utils/request');
const { ensureLogin } = require('../../utils/auth');
const { ensureProfileReady } = require('../../utils/profile');
const { modeLabel, mealLabel } = require('../../utils/constants');
const { intakeStatus } = require('../../utils/nutrition');
const { todayISO, addDays, formatDateLabel, isToday } = require('../../utils/date');

Page({
  data: {
    summary: null,
    modeLabel: '',
    viewDate: '',
    dateLabel: '',
    isToday: true,
    canGoNext: false,
    maxDate: '',
    logsTitle: '今日记录',
    caloriePercent: 0,
    progressColor: '#1b7a5a',
    statusLevel: 'ok',
    statusText: '达标',
    overCalories: 0,
    macroBars: [],
    loading: true,
  },

  async onShow() {
    await ensureLogin();
    const profile = await ensureProfileReady();
    if (!profile) return;
    const viewDate = this.data.viewDate || todayISO();
    this.setData({ modeLabel: modeLabel(profile.healthMode) });
    this.applyViewDate(viewDate);
  },

  applyViewDate(viewDate) {
    const today = todayISO();
    const viewingToday = isToday(viewDate);
    this.setData({
      viewDate,
      maxDate: today,
      dateLabel: formatDateLabel(viewDate),
      isToday: viewingToday,
      canGoNext: viewDate < today,
      logsTitle: viewingToday ? '今日记录' : '当日记录',
    });
    this.loadSummary();
  },

  onPrevDay() {
    const viewDate = addDays(this.data.viewDate, -1);
    this.applyViewDate(viewDate);
  },

  onNextDay() {
    if (!this.data.canGoNext) return;
    const viewDate = addDays(this.data.viewDate, 1);
    this.applyViewDate(viewDate);
  },

  onDateChange(e) {
    const picked = e.detail.value;
    if (picked) this.applyViewDate(picked);
  },

  onBackToday() {
    this.applyViewDate(todayISO());
  },

  async loadSummary() {
    this.setData({ loading: true });
    try {
      const { viewDate } = this.data;
      const summary = await request({
        url: `/food-logs/daily-summary?date=${viewDate}`,
      });
      const targets = summary.targets;
      const consumed = summary.consumed;

      const caloriePercent = Math.min(
        100,
        Math.round((consumed.calories / targets.calories) * 100),
      );

      const status = summary.intakeStatus?.overall
        ? {
            level: summary.intakeStatus.overall.level,
            text: summary.intakeStatus.overall.label,
          }
        : intakeStatus(consumed.calories, targets.calories);
      let progressColor = '#1b7a5a';
      if (status.level === 'warn' || status.level === 'low') progressColor = '#e6a23c';
      if (status.level === 'over') progressColor = '#c62828';

      const logs = summary.logs.map((log) => ({
        ...log,
        mealLabel: mealLabel(log.mealType),
      }));

      const macroStatuses = summary.intakeStatus ?? {};
      const macroBars = [
        macroBar(
          '蛋白',
          consumed.proteinG,
          targets.proteinG,
          'g',
          '#4a90d9',
          macroStatuses.protein,
        ),
        macroBar(
          '碳水',
          consumed.carbsG,
          targets.carbsG,
          'g',
          '#e6a23c',
          macroStatuses.carbs,
        ),
        macroBar(
          '脂肪',
          consumed.fatG,
          targets.fatG,
          'g',
          '#9b59b6',
          macroStatuses.fat,
        ),
      ];

      this.setData({
        summary: { ...summary, logs },
        caloriePercent,
        progressColor,
        statusLevel: status.level,
        statusText: status.text,
        overCalories: Math.abs(Math.round(summary.remaining.calories)),
        macroBars,
        loading: false,
      });
    } catch (e) {
      this.setData({ loading: false });
      wx.showToast({ title: e.message || '加载失败', icon: 'none' });
    }
  },

  onPullDownRefresh() {
    this.loadSummary().finally(() => wx.stopPullDownRefresh());
  },

  goRecord() {
    wx.switchTab({ url: '/pages/record/record' });
  },

  goTrend() {
    wx.switchTab({ url: '/pages/trend/trend' });
  },
});

function macroBar(label, consumed, target, unit, color, status) {
  const percent = target > 0 ? Math.min(100, Math.round((consumed / target) * 100)) : 0;
  return {
    key: label,
    label,
    consumed: Math.round(consumed * 10) / 10,
    target: Math.round(target * 10) / 10,
    unit,
    percent,
    color,
    statusLabel: status?.label ?? '',
    statusLevel: status?.level ?? 'ok',
  };
}
