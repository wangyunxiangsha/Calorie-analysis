import { Food } from '@prisma/client';

export type Nutrients = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export function nutrientsForServing(food: Food, servingG: number): Nutrients {
  const ratio = servingG / 100;
  return {
    calories: round(Number(food.caloriesPer100g) * ratio),
    proteinG: round(Number(food.proteinPer100g) * ratio),
    carbsG: round(Number(food.carbsPer100g) * ratio),
    fatG: round(Number(food.fatPer100g) * ratio),
  };
}

function round(n: number) {
  return Math.round(n * 10) / 10;
}
