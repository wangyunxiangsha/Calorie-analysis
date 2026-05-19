const HEALTH_MODES = [
  { id: 'lose_fat', label: '减脂', desc: '控制热量缺口，关注剩余额度' },
  { id: 'gain_muscle', label: '增肌塑形', desc: '蛋白优先，支持训练日饮食' },
  { id: 'metabolic', label: '代谢管理', desc: '关注糖、钠等指标（非医疗建议）' },
  { id: 'pregnancy', label: '孕产期', desc: '阶段化营养参考，请遵医嘱' },
  { id: 'wellness', label: '轻健康', desc: '温和记录，看长期趋势' },
];

const MEAL_TYPES = [
  { id: 'breakfast', label: '早餐' },
  { id: 'lunch', label: '午餐' },
  { id: 'dinner', label: '晚餐' },
  { id: 'snack', label: '加餐' },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: '久坐少动' },
  { id: 'light', label: '轻度活动' },
  { id: 'moderate', label: '中度活动' },
  { id: 'active', label: '高强度' },
];

function mealLabel(id) {
  return MEAL_TYPES.find((m) => m.id === id)?.label || id;
}

function modeLabel(id) {
  return HEALTH_MODES.find((m) => m.id === id)?.label || id;
}

function defaultMealType() {
  const h = new Date().getHours();
  if (h < 10) return 'breakfast';
  if (h < 14) return 'lunch';
  if (h < 21) return 'dinner';
  return 'snack';
}

module.exports = {
  HEALTH_MODES,
  MEAL_TYPES,
  ACTIVITY_LEVELS,
  mealLabel,
  modeLabel,
  defaultMealType,
};
