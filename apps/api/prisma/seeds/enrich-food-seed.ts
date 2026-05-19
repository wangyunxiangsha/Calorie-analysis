import { mergeAliasList } from './seed-alias.util';
import { FOOD_ALIAS_REGISTRY } from './alias-registry';
import { FOOD_ALIAS_REGISTRY_EXT } from './alias-registry-ext';

const MERGED_ALIAS_REGISTRY = {
  ...FOOD_ALIAS_REGISTRY,
  ...FOOD_ALIAS_REGISTRY_EXT,
};
import type { FoodSeed } from './food-types';

/** 种子写入前：合并注册表别名 + 自动生成简称 */
export function enrichFoodSeed(food: FoodSeed): FoodSeed {
  const aliases = mergeAliasList(
    food.name,
    food.aliases ?? [],
    MERGED_ALIAS_REGISTRY,
  )
    .map((a) => a.trim())
    .filter((a) => a.length >= 2);

  return {
    ...food,
    aliases: [...new Set(aliases)],
  };
}

export function enrichFoodCatalog(foods: FoodSeed[]): FoodSeed[] {
  return foods.map(enrichFoodSeed);
}
