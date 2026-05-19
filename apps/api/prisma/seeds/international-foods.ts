import type { FoodSeed } from './food-types';

/** 国外经典美食（日韩东南亚欧美） */
export const internationalFoods: FoodSeed[] = [
  // 日式
  { name: '寿司拼盘', category: '日料', aliases: ['寿司', 'sushi', '握寿司'], caloriesPer100g: 145, proteinPer100g: 7, carbsPer100g: 24, fatPer100g: 3, defaultServingG: 250, servingUnit: '份' },
  { name: '三文鱼刺身', category: '日料', aliases: ['刺身', '三文鱼', 'sashimi'], caloriesPer100g: 145, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 7, defaultServingG: 150, servingUnit: '份' },
  { name: '日式拉面', category: '日料', aliases: ['拉面', '豚骨拉面', 'ramen'], caloriesPer100g: 135, proteinPer100g: 7, carbsPer100g: 18, fatPer100g: 5, defaultServingG: 500, servingUnit: '碗' },
  { name: '天妇罗', category: '日料', aliases: ['炸虾天妇罗', 'tempura'], caloriesPer100g: 245, proteinPer100g: 8, carbsPer100g: 22, fatPer100g: 14, defaultServingG: 180, servingUnit: '份' },
  { name: '日式咖喱饭', category: '日料', aliases: ['咖喱饭', '日式咖喱'], caloriesPer100g: 155, proteinPer100g: 6, carbsPer100g: 22, fatPer100g: 5, defaultServingG: 400, servingUnit: '碗' },
  { name: '鳗鱼饭', category: '日料', aliases: ['蒲烧鳗鱼饭', '日式鳗鱼饭'], caloriesPer100g: 195, proteinPer100g: 12, carbsPer100g: 24, fatPer100g: 7, defaultServingG: 380, servingUnit: '碗' },
  { name: '章鱼烧', category: '日料', aliases: ['たこ焼き', '大阪章鱼烧'], caloriesPer100g: 220, proteinPer100g: 8, carbsPer100g: 28, fatPer100g: 9, defaultServingG: 120, servingUnit: '份' },
  { name: '味噌汤', category: '日料', aliases: ['味噌汁', 'miso soup'], caloriesPer100g: 35, proteinPer100g: 3, carbsPer100g: 3, fatPer100g: 2, defaultServingG: 200, servingUnit: '碗' },
  { name: '亲子丼', category: '日料', aliases: ['亲子饭', '鸡肉鸡蛋饭'], caloriesPer100g: 165, proteinPer100g: 11, carbsPer100g: 20, fatPer100g: 6, defaultServingG: 380, servingUnit: '碗' },
  { name: '牛丼（日式）', category: '日料', aliases: ['日式牛肉饭'], caloriesPer100g: 170, proteinPer100g: 11, carbsPer100g: 21, fatPer100g: 6, defaultServingG: 380, servingUnit: '碗' },

  // 韩式
  { name: '韩式烤肉', category: '韩餐', aliases: ['韩国烤肉', '烤五花肉'], caloriesPer100g: 285, proteinPer100g: 18, carbsPer100g: 2, fatPer100g: 23, defaultServingG: 200, servingUnit: '份' },
  { name: '石锅拌饭', category: '韩餐', aliases: ['拌饭', 'bibimbap'], caloriesPer100g: 155, proteinPer100g: 7, carbsPer100g: 22, fatPer100g: 5, defaultServingG: 400, servingUnit: '碗' },
  { name: '部队锅', category: '韩餐', aliases: ['韩式部队锅', '部队火锅'], caloriesPer100g: 125, proteinPer100g: 8, carbsPer100g: 10, fatPer100g: 7, defaultServingG: 450, servingUnit: '份' },
  { name: '韩式炸鸡', category: '韩餐', aliases: ['韩国炸鸡', '甜辣炸鸡'], caloriesPer100g: 265, proteinPer100g: 19, carbsPer100g: 12, fatPer100g: 17, defaultServingG: 200, servingUnit: '份' },
  { name: '泡菜汤', category: '韩餐', aliases: ['kimchi jjigae', '泡菜锅'], caloriesPer100g: 55, proteinPer100g: 4, carbsPer100g: 5, fatPer100g: 3, defaultServingG: 350, servingUnit: '碗' },
  { name: '炒年糕', category: '韩餐', aliases: ['辣炒年糕', '韩式年糕'], caloriesPer100g: 175, proteinPer100g: 4, carbsPer100g: 32, fatPer100g: 4, defaultServingG: 250, servingUnit: '份' },
  { name: '参鸡汤', category: '韩餐', aliases: ['韩国参鸡汤'], caloriesPer100g: 75, proteinPer100g: 9, carbsPer100g: 2, fatPer100g: 4, defaultServingG: 400, servingUnit: '碗' },

  // 泰越印
  { name: '冬阴功汤', category: '泰餐', aliases: ['冬阴功', 'tom yum'], caloriesPer100g: 65, proteinPer100g: 6, carbsPer100g: 5, fatPer100g: 3, defaultServingG: 300, servingUnit: '碗' },
  { name: '泰式炒河粉', category: '泰餐', aliases: ['pad thai', '泰式河粉'], caloriesPer100g: 175, proteinPer100g: 7, carbsPer100g: 26, fatPer100g: 6, defaultServingG: 350, servingUnit: '份' },
  { name: '绿咖喱鸡', category: '泰餐', aliases: ['泰式绿咖喱', 'green curry'], caloriesPer100g: 145, proteinPer100g: 12, carbsPer100g: 6, fatPer100g: 9, defaultServingG: 300, servingUnit: '份' },
  { name: '越南河粉', category: '越餐', aliases: ['pho', '牛肉河粉'], caloriesPer100g: 95, proteinPer100g: 7, carbsPer100g: 12, fatPer100g: 3, defaultServingG: 450, servingUnit: '碗' },
  { name: '越南春卷', category: '越餐', aliases: ['米纸卷', 'spring roll'], caloriesPer100g: 120, proteinPer100g: 6, carbsPer100g: 18, fatPer100g: 3, defaultServingG: 150, servingUnit: '份' },
  { name: '印度咖喱鸡', category: '印餐', aliases: ['咖喱鸡', 'butter chicken', '印度咖喱'], caloriesPer100g: 165, proteinPer100g: 14, carbsPer100g: 6, fatPer100g: 10, defaultServingG: 300, servingUnit: '份' },
  { name: '印度烤饼', category: '印餐', aliases: ['馕饼', 'naan'], caloriesPer100g: 285, proteinPer100g: 9, carbsPer100g: 48, fatPer100g: 7, defaultServingG: 80, servingUnit: '张' },
  { name: '马来椰浆饭', category: '东南亚', aliases: ['椰浆饭', 'nasi lemak'], caloriesPer100g: 195, proteinPer100g: 6, carbsPer100g: 28, fatPer100g: 8, defaultServingG: 350, servingUnit: '份' },

  // 西式
  { name: '牛排（西冷）', category: '西餐', aliases: ['西冷牛排', 'steak', '牛排'], caloriesPer100g: 250, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 16, defaultServingG: 200, servingUnit: '份' },
  { name: '意大利肉酱面', category: '西餐', aliases: ['spaghetti bolognese', '肉酱意面'], caloriesPer100g: 155, proteinPer100g: 8, carbsPer100g: 20, fatPer100g: 5, defaultServingG: 350, servingUnit: '份' },
  { name: '奶油蘑菇汤', category: '西餐', aliases: ['蘑菇浓汤'], caloriesPer100g: 75, proteinPer100g: 3, carbsPer100g: 5, fatPer100g: 5, defaultServingG: 250, servingUnit: '碗' },
  { name: '凯撒沙拉', category: '西餐', aliases: ['caesar salad', '凯撒沙律'], caloriesPer100g: 95, proteinPer100g: 6, carbsPer100g: 6, fatPer100g: 7, defaultServingG: 250, servingUnit: '份' },
  { name: '法式焗蜗牛', category: '西餐', aliases: ['焗蜗牛'], caloriesPer100g: 145, proteinPer100g: 14, carbsPer100g: 3, fatPer100g: 9, defaultServingG: 120, servingUnit: '份' },
  { name: '炸鱼薯条', category: '西餐', aliases: ['fish and chips', '英式炸鱼'], caloriesPer100g: 245, proteinPer100g: 12, carbsPer100g: 26, fatPer100g: 12, defaultServingG: 350, servingUnit: '份' },
  { name: '牛肉汉堡', category: '西餐', aliases: ['汉堡', 'cheeseburger', '芝士汉堡'], caloriesPer100g: 255, proteinPer100g: 14, carbsPer100g: 20, fatPer100g: 14, defaultServingG: 220, servingUnit: '个' },
  { name: '热狗', category: '西餐', aliases: ['hot dog'], caloriesPer100g: 265, proteinPer100g: 10, carbsPer100g: 28, fatPer100g: 13, defaultServingG: 150, servingUnit: '个' },
  { name: '炸鸡腿（美式）', category: '西餐', aliases: ['fried chicken', '美式炸鸡'], caloriesPer100g: 260, proteinPer100g: 20, carbsPer100g: 10, fatPer100g: 17, defaultServingG: 180, servingUnit: '份' },

  // 墨西哥 / 中东 / 地中海
  { name: '墨西哥卷饼', category: '墨西哥菜', aliases: ['burrito', '卷饼'], caloriesPer100g: 210, proteinPer100g: 10, carbsPer100g: 24, fatPer100g: 9, defaultServingG: 280, servingUnit: '个' },
  { name: '玉米片配莎莎', category: '墨西哥菜', aliases: ['nachos', '玉米片'], caloriesPer100g: 285, proteinPer100g: 6, carbsPer100g: 32, fatPer100g: 15, defaultServingG: 150, servingUnit: '份' },
  { name: '塔可', category: '墨西哥菜', aliases: ['taco', '墨西哥塔可'], caloriesPer100g: 225, proteinPer100g: 11, carbsPer100g: 20, fatPer100g: 12, defaultServingG: 120, servingUnit: '个' },
  { name: '鹰嘴豆泥', category: '中东菜', aliases: ['hummus'], caloriesPer100g: 165, proteinPer100g: 8, carbsPer100g: 14, fatPer100g: 10, defaultServingG: 100, servingUnit: '份' },
  { name: '沙威玛', category: '中东菜', aliases: ['shawarma', '土耳其烤肉卷'], caloriesPer100g: 235, proteinPer100g: 14, carbsPer100g: 22, fatPer100g: 11, defaultServingG: 250, servingUnit: '个' },
  { name: '希腊沙拉', category: '地中海', aliases: ['greek salad'], caloriesPer100g: 85, proteinPer100g: 5, carbsPer100g: 6, fatPer100g: 6, defaultServingG: 250, servingUnit: '份' },
  { name: '意大利千层面', category: '西餐', aliases: ['lasagna', '千层面'], caloriesPer100g: 175, proteinPer100g: 10, carbsPer100g: 16, fatPer100g: 9, defaultServingG: 300, servingUnit: '份' },

  // 西式早餐甜品
  { name: '牛角包', category: '西餐', aliases: ['可颂', 'croissant'], caloriesPer100g: 410, proteinPer100g: 8, carbsPer100g: 45, fatPer100g: 22, defaultServingG: 60, servingUnit: '个' },
  { name: '华夫饼', category: '西餐', aliases: ['waffle', '比利时华夫'], caloriesPer100g: 295, proteinPer100g: 6, carbsPer100g: 42, fatPer100g: 12, defaultServingG: 120, servingUnit: '份' },
  { name: '芝士蛋糕', category: '西餐', aliases: ['cheesecake', '纽约芝士蛋糕'], caloriesPer100g: 325, proteinPer100g: 6, carbsPer100g: 28, fatPer100g: 22, defaultServingG: 120, servingUnit: '块' },
  { name: '提拉米苏', category: '西餐', aliases: ['tiramisu'], caloriesPer100g: 285, proteinPer100g: 5, carbsPer100g: 32, fatPer100g: 15, defaultServingG: 100, servingUnit: '块' },
  { name: '巧克力布朗尼', category: '西餐', aliases: ['brownie', '布朗尼'], caloriesPer100g: 405, proteinPer100g: 5, carbsPer100g: 48, fatPer100g: 22, defaultServingG: 80, servingUnit: '块' },
  { name: '法式吐司', category: '西餐', aliases: ['西多士', 'french toast'], caloriesPer100g: 225, proteinPer100g: 8, carbsPer100g: 28, fatPer100g: 10, defaultServingG: 150, servingUnit: '份' },
  { name: '班尼迪克蛋', category: '西餐', aliases: ['eggs benedict'], caloriesPer100g: 195, proteinPer100g: 11, carbsPer100g: 12, fatPer100g: 13, defaultServingG: 200, servingUnit: '份' },
];
