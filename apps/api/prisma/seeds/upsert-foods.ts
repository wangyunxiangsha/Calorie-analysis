import { PrismaClient } from '@prisma/client';
import { enrichFoodSeed } from './enrich-food-seed';
import type { FoodSeed } from './food-types';

export async function upsertFoods(prisma: PrismaClient, foods: FoodSeed[]) {
  let created = 0;
  let updated = 0;

  for (const raw of foods) {
    const food = enrichFoodSeed(raw);
    const existing = await prisma.food.findFirst({
      where: { name: food.name },
    });

    if (existing) {
      const mergedAliases = [
        ...new Set([...(existing.aliases ?? []), ...(food.aliases ?? [])]),
      ];
      await prisma.food.update({
        where: { id: existing.id },
        data: {
          aliases: mergedAliases,
          category: food.category,
          caloriesPer100g: food.caloriesPer100g,
          proteinPer100g: food.proteinPer100g,
          carbsPer100g: food.carbsPer100g,
          fatPer100g: food.fatPer100g,
          defaultServingG: food.defaultServingG,
          servingUnit: food.servingUnit,
        },
      });
      updated += 1;
      continue;
    }

    await prisma.food.create({ data: food });
    created += 1;
  }

  return { created, updated, total: foods.length };
}
