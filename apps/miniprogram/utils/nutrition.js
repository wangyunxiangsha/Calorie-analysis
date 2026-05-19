function calcNutrients(food, servingG) {
  const g = Number(servingG) || 100;
  const ratio = g / 100;
  return {
    calories: round(Number(food.caloriesPer100g) * ratio),
    proteinG: round(Number(food.proteinPer100g) * ratio),
    carbsG: round(Number(food.carbsPer100g) * ratio),
    fatG: round(Number(food.fatPer100g) * ratio),
  };
}

function round(n) {
  return Math.round(n * 10) / 10;
}

function intakeStatus(consumed, target) {
  if (!target || target <= 0) return { level: 'ok', text: '达标' };
  const ratio = consumed / target;
  if (ratio <= 1) return { level: 'ok', text: '达标' };
  if (ratio <= 1.1) return { level: 'warn', text: '注意' };
  return { level: 'over', text: '超标' };
}

module.exports = { calcNutrients, intakeStatus };
