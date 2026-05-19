import type { FoodSeed } from './food-types';

/** 快餐连锁 + 便利店便当 */
export const fastfoodConvenienceFoods: FoodSeed[] = [
  // 肯德基
  { name: '肯德基香辣鸡腿堡', category: '快餐', aliases: ['香辣鸡腿堡', 'KFC汉堡'], caloriesPer100g: 245, proteinPer100g: 13, carbsPer100g: 22, fatPer100g: 12, defaultServingG: 220, servingUnit: '个' },
  { name: '肯德基劲脆鸡腿堡', category: '快餐', aliases: ['劲脆鸡腿堡'], caloriesPer100g: 250, proteinPer100g: 14, carbsPer100g: 21, fatPer100g: 13, defaultServingG: 220, servingUnit: '个' },
  { name: '肯德基薯条（中）', category: '快餐', aliases: ['薯条', 'KFC薯条'], caloriesPer100g: 310, proteinPer100g: 4, carbsPer100g: 41, fatPer100g: 15, defaultServingG: 110, servingUnit: '份' },
  { name: '肯德基蛋挞', category: '快餐', aliases: ['葡式蛋挞', 'KFC蛋挞'], caloriesPer100g: 380, proteinPer100g: 5, carbsPer100g: 35, fatPer100g: 24, defaultServingG: 60, servingUnit: '个' },
  { name: '肯德基鸡米花', category: '快餐', aliases: ['鸡米花'], caloriesPer100g: 265, proteinPer100g: 16, carbsPer100g: 18, fatPer100g: 15, defaultServingG: 100, servingUnit: '份' },
  { name: '肯德基上校鸡块', category: '快餐', aliases: ['鸡块', '黄金鸡块'], caloriesPer100g: 255, proteinPer100g: 15, carbsPer100g: 16, fatPer100g: 16, defaultServingG: 120, servingUnit: '份' },

  // 麦当劳
  { name: '麦当劳巨无霸', category: '快餐', aliases: ['巨无霸', 'big mac'], caloriesPer100g: 250, proteinPer100g: 13, carbsPer100g: 20, fatPer100g: 14, defaultServingG: 220, servingUnit: '个' },
  { name: '麦当劳麦辣鸡腿堡', category: '快餐', aliases: ['麦辣鸡腿堡', '麦辣堡'], caloriesPer100g: 248, proteinPer100g: 14, carbsPer100g: 21, fatPer100g: 13, defaultServingG: 215, servingUnit: '个' },
  { name: '麦当劳麦乐鸡', category: '快餐', aliases: ['麦乐鸡', 'mcnuggets'], caloriesPer100g: 260, proteinPer100g: 16, carbsPer100g: 15, fatPer100g: 17, defaultServingG: 100, servingUnit: '份' },
  { name: '麦当劳薯条（中）', category: '快餐', aliases: ['麦当劳薯条'], caloriesPer100g: 312, proteinPer100g: 4, carbsPer100g: 42, fatPer100g: 15, defaultServingG: 110, servingUnit: '份' },
  { name: '麦当劳双层吉士堡', category: '快餐', aliases: ['双层吉士堡', '双层芝士堡'], caloriesPer100g: 265, proteinPer100g: 16, carbsPer100g: 18, fatPer100g: 16, defaultServingG: 200, servingUnit: '个' },

  // 汉堡王 / 德克士 / 华莱士 / 塔斯汀
  { name: '汉堡王皇堡', category: '快餐', aliases: ['皇堡', 'whopper'], caloriesPer100g: 245, proteinPer100g: 14, carbsPer100g: 19, fatPer100g: 14, defaultServingG: 280, servingUnit: '个' },
  { name: '德克士手枪腿', category: '快餐', aliases: ['手枪腿', '脆皮炸鸡'], caloriesPer100g: 275, proteinPer100g: 20, carbsPer100g: 10, fatPer100g: 18, defaultServingG: 180, servingUnit: '份' },
  { name: '华莱士全鸡', category: '快餐', aliases: ['华莱士炸鸡'], caloriesPer100g: 235, proteinPer100g: 21, carbsPer100g: 8, fatPer100g: 14, defaultServingG: 400, servingUnit: '只' },
  { name: '塔斯汀中国汉堡', category: '快餐', aliases: ['塔斯汀汉堡', '手擀堡'], caloriesPer100g: 240, proteinPer100g: 13, carbsPer100g: 23, fatPer100g: 12, defaultServingG: 200, servingUnit: '个' },

  // 必胜客 / 达美乐
  { name: '必胜客披萨（芝士）', category: '快餐', aliases: ['披萨', '比萨', '芝士披萨'], caloriesPer100g: 265, proteinPer100g: 12, carbsPer100g: 28, fatPer100g: 12, defaultServingG: 200, servingUnit: '片' },
  { name: '必胜客意面', category: '快餐', aliases: ['肉酱意面', '意大利面'], caloriesPer100g: 155, proteinPer100g: 7, carbsPer100g: 22, fatPer100g: 5, defaultServingG: 350, servingUnit: '份' },
  { name: '达美乐披萨', category: '快餐', aliases: ['达美乐'], caloriesPer100g: 270, proteinPer100g: 11, carbsPer100g: 29, fatPer100g: 13, defaultServingG: 180, servingUnit: '片' },

  // 赛百味 / 真功夫 / 吉野家
  { name: '赛百味三明治（鸡胸）', category: '快餐', aliases: ['subway', '赛百味'], caloriesPer100g: 195, proteinPer100g: 14, carbsPer100g: 24, fatPer100g: 5, defaultServingG: 250, servingUnit: '个' },
  { name: '真功夫香菇滑鸡饭', category: '快餐', aliases: ['真功夫', '香菇滑鸡饭'], caloriesPer100g: 155, proteinPer100g: 9, carbsPer100g: 20, fatPer100g: 5, defaultServingG: 400, servingUnit: '份' },
  { name: '吉野家牛肉饭', category: '快餐', aliases: ['吉野家', '牛丼', '牛肉饭'], caloriesPer100g: 165, proteinPer100g: 10, carbsPer100g: 22, fatPer100g: 5, defaultServingG: 380, servingUnit: '碗' },
  { name: '和合谷宫保鸡丁饭', category: '快餐', aliases: ['和合谷'], caloriesPer100g: 160, proteinPer100g: 9, carbsPer100g: 21, fatPer100g: 5, defaultServingG: 400, servingUnit: '份' },

  // 咖啡茶饮连锁
  { name: '星巴克拿铁', category: '连锁饮品', aliases: ['星巴克咖啡', 'starbucks latte'], caloriesPer100g: 48, proteinPer100g: 3, carbsPer100g: 5, fatPer100g: 2, defaultServingG: 350, servingUnit: '杯' },
  { name: '星巴克美式', category: '连锁饮品', aliases: ['美式咖啡'], caloriesPer100g: 5, proteinPer100g: 0.5, carbsPer100g: 0.5, fatPer100g: 0, defaultServingG: 350, servingUnit: '杯' },
  { name: '瑞幸生椰拿铁', category: '连锁饮品', aliases: ['生椰拿铁', '瑞幸咖啡'], caloriesPer100g: 52, proteinPer100g: 2, carbsPer100g: 6, fatPer100g: 2, defaultServingG: 350, servingUnit: '杯' },
  { name: '喜茶多肉葡萄', category: '连锁饮品', aliases: ['喜茶', '多肉葡萄'], caloriesPer100g: 68, proteinPer100g: 0.5, carbsPer100g: 15, fatPer100g: 0.5, defaultServingG: 500, servingUnit: '杯' },
  { name: '蜜雪冰城柠檬水', category: '连锁饮品', aliases: ['蜜雪冰城', '柠檬水'], caloriesPer100g: 35, proteinPer100g: 0, carbsPer100g: 9, fatPer100g: 0, defaultServingG: 500, servingUnit: '杯' },

  // 便利店 — 全家 / 罗森 / 7-11
  { name: '全家奥尔良饭团', category: '便利店', aliases: ['全家饭团', '奥尔良饭团'], caloriesPer100g: 195, proteinPer100g: 6, carbsPer100g: 32, fatPer100g: 5, defaultServingG: 110, servingUnit: '个' },
  { name: '全家三明治（鸡蛋）', category: '便利店', aliases: ['全家三明治'], caloriesPer100g: 210, proteinPer100g: 9, carbsPer100g: 26, fatPer100g: 8, defaultServingG: 150, servingUnit: '个' },
  { name: '全家咖喱鸡排饭', category: '便利店', aliases: ['咖喱鸡排饭', '全家便当'], caloriesPer100g: 175, proteinPer100g: 8, carbsPer100g: 24, fatPer100g: 6, defaultServingG: 380, servingUnit: '份' },
  { name: '全家番茄肉酱意面', category: '便利店', aliases: ['肉酱意面便当'], caloriesPer100g: 150, proteinPer100g: 7, carbsPer100g: 22, fatPer100g: 4, defaultServingG: 320, servingUnit: '份' },
  { name: '罗森照烧鸡排饭', category: '便利店', aliases: ['罗森便当', '照烧鸡排饭'], caloriesPer100g: 170, proteinPer100g: 9, carbsPer100g: 23, fatPer100g: 6, defaultServingG: 380, servingUnit: '份' },
  { name: '罗森三文鱼饭团', category: '便利店', aliases: ['三文鱼饭团', '罗森饭团'], caloriesPer100g: 185, proteinPer100g: 8, carbsPer100g: 30, fatPer100g: 4, defaultServingG: 110, servingUnit: '个' },
  { name: '罗森土豆泥沙拉', category: '便利店', aliases: ['土豆沙拉'], caloriesPer100g: 125, proteinPer100g: 3, carbsPer100g: 15, fatPer100g: 6, defaultServingG: 150, servingUnit: '份' },
  { name: '7-11鱼籽拌饭', category: '便利店', aliases: ['711便当', '鱼籽饭'], caloriesPer100g: 165, proteinPer100g: 8, carbsPer100g: 24, fatPer100g: 5, defaultServingG: 350, servingUnit: '份' },
  { name: '7-11蒲烧鳗鱼饭', category: '便利店', aliases: ['鳗鱼饭便当', '蒲烧鳗鱼'], caloriesPer100g: 185, proteinPer100g: 11, carbsPer100g: 24, fatPer100g: 6, defaultServingG: 360, servingUnit: '份' },
  { name: '7-11金枪鱼沙拉饭团', category: '便利店', aliases: ['金枪鱼饭团'], caloriesPer100g: 190, proteinPer100g: 7, carbsPer100g: 31, fatPer100g: 5, defaultServingG: 110, servingUnit: '个' },
  { name: '便利店关东煮（素）', category: '便利店', aliases: ['关东煮', '便利店煮物'], caloriesPer100g: 55, proteinPer100g: 3, carbsPer100g: 8, fatPer100g: 1, defaultServingG: 300, servingUnit: '碗' },
  { name: '便利店鸡胸肉沙拉', category: '便利店', aliases: ['鸡胸沙拉', '轻食沙拉'], caloriesPer100g: 85, proteinPer100g: 12, carbsPer100g: 5, fatPer100g: 2, defaultServingG: 250, servingUnit: '份' },

  // 外卖常见
  { name: '沙县鸡腿饭', category: '外卖', aliases: ['沙县小吃套餐'], caloriesPer100g: 175, proteinPer100g: 12, carbsPer100g: 20, fatPer100g: 7, defaultServingG: 420, servingUnit: '份' },
  { name: '老乡鸡肥西老母鸡汤', category: '快餐', aliases: ['老乡鸡', '老母鸡汤'], caloriesPer100g: 45, proteinPer100g: 5, carbsPer100g: 1, fatPer100g: 2, defaultServingG: 350, servingUnit: '碗' },
  { name: '杨国福麻辣烫', category: '外卖', aliases: ['杨国福', '麻辣烫套餐'], caloriesPer100g: 110, proteinPer100g: 6, carbsPer100g: 10, fatPer100g: 6, defaultServingG: 450, servingUnit: '碗' },
  { name: '张亮麻辣烫', category: '外卖', aliases: ['张亮'], caloriesPer100g: 105, proteinPer100g: 6, carbsPer100g: 11, fatPer100g: 5, defaultServingG: 450, servingUnit: '碗' },
];
