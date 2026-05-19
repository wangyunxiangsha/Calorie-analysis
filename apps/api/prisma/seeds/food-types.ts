export type FoodSeed = {
  name: string;
  category: string;
  aliases?: string[];
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  defaultServingG: number;
  servingUnit: string;
};
