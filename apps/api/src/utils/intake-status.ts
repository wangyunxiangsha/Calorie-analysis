import { HealthMode } from '@prisma/client';

export type IntakeStatusLevel = 'ok' | 'warn' | 'over' | 'low';

export type IntakeStatus = {
  level: IntakeStatusLevel;
  label: string;
};

type MacroTotals = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

type MacroTargets = MacroTotals & {
  sodiumMg?: number;
  sugarG?: number;
};

function ratio(consumed: number, target: number) {
  if (!target || target <= 0) return 0;
  return consumed / target;
}

/** Single nutrient vs target (protein/carbs/fat). */
export function macroIntakeStatus(
  consumed: number,
  target: number,
  mode?: HealthMode,
): IntakeStatus {
  if (!target || target <= 0) return { level: 'ok', label: '达标' };
  const r = ratio(consumed, target);

  if (mode === HealthMode.gain_muscle) {
    if (r < 0.85) return { level: 'low', label: '未达标' };
    if (r <= 1.1) return { level: 'ok', label: '达标' };
    if (r <= 1.2) return { level: 'warn', label: '注意' };
    return { level: 'over', label: '超标' };
  }

  if (r <= 1) return { level: 'ok', label: '达标' };
  if (r <= 1.1) return { level: 'warn', label: '注意' };
  return { level: 'over', label: '超标' };
}

/** Daily calorie status; thresholds vary slightly by health mode. */
export function calorieIntakeStatus(
  consumed: number,
  target: number,
  mode?: HealthMode,
): IntakeStatus {
  if (!target || target <= 0) return { level: 'ok', label: '达标' };
  const r = ratio(consumed, target);

  switch (mode) {
    case HealthMode.lose_fat:
      if (r <= 1) return { level: 'ok', label: '达标' };
      if (r <= 1.08) return { level: 'warn', label: '注意' };
      return { level: 'over', label: '超标' };
    case HealthMode.gain_muscle:
      if (r < 0.9) return { level: 'low', label: '未达标' };
      if (r <= 1.1) return { level: 'ok', label: '达标' };
      if (r <= 1.15) return { level: 'warn', label: '注意' };
      return { level: 'over', label: '超标' };
    case HealthMode.wellness:
    case HealthMode.pregnancy:
      if (r <= 1.05) return { level: 'ok', label: '达标' };
      if (r <= 1.12) return { level: 'warn', label: '注意' };
      return { level: 'over', label: '超标' };
    case HealthMode.metabolic:
      if (r <= 1) return { level: 'ok', label: '达标' };
      if (r <= 1.05) return { level: 'warn', label: '注意' };
      return { level: 'over', label: '超标' };
    default:
      if (r <= 1) return { level: 'ok', label: '达标' };
      if (r <= 1.1) return { level: 'warn', label: '注意' };
      return { level: 'over', label: '超标' };
  }
}

export function computeDailyIntakeStatus(
  consumed: MacroTotals,
  targets: MacroTargets,
  mode?: HealthMode,
) {
  const calories = calorieIntakeStatus(consumed.calories, targets.calories, mode);
  const protein = macroIntakeStatus(consumed.proteinG, targets.proteinG, mode);
  const carbs = macroIntakeStatus(consumed.carbsG, targets.carbsG, mode);
  const fat = macroIntakeStatus(consumed.fatG, targets.fatG, mode);

  const levels: IntakeStatusLevel[] = [
    calories.level,
    protein.level,
    carbs.level,
    fat.level,
  ];
  const worst = levels.includes('over')
    ? 'over'
    : levels.includes('warn')
      ? 'warn'
      : levels.includes('low')
        ? 'low'
        : 'ok';

  const overallLabel =
    worst === 'over'
      ? '超标'
      : worst === 'warn'
        ? '注意'
        : worst === 'low'
          ? '未达标'
          : '达标';

  return {
    overall: { level: worst, label: overallLabel },
    calories,
    protein,
    carbs,
    fat,
  };
}
