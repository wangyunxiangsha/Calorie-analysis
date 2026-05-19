import type { FoodSeed } from './food-types';

/**
 * 中餐食物库扩充（每 100g 营养值为常见家常/餐馆估算，供记录与识别匹配）
 * 运行 npm run db:seed 写入数据库；已存在同名条目会合并别名并更新营养字段
 */
export const chineseFoods: FoodSeed[] = [
  // —— 家常菜 ——
  { name: '可乐鸡翅', category: '家常菜', aliases: ['可乐鸡', '可乐鸡翼', 'cola chicken'], caloriesPer100g: 198, proteinPer100g: 15, carbsPer100g: 12, fatPer100g: 10, defaultServingG: 200, servingUnit: '份' },
  { name: '鱼香肉丝', category: '家常菜', aliases: ['鱼香肉'], caloriesPer100g: 185, proteinPer100g: 11, carbsPer100g: 10, fatPer100g: 12, defaultServingG: 200, servingUnit: '份' },
  { name: '糖醋里脊', category: '家常菜', aliases: ['糖醋肉', '咕噜肉'], caloriesPer100g: 220, proteinPer100g: 14, carbsPer100g: 18, fatPer100g: 11, defaultServingG: 180, servingUnit: '份' },
  { name: '回锅肉', category: '家常菜', caloriesPer100g: 280, proteinPer100g: 13, carbsPer100g: 6, fatPer100g: 22, defaultServingG: 180, servingUnit: '份' },
  { name: '青椒肉丝', category: '家常菜', aliases: ['青椒炒肉'], caloriesPer100g: 165, proteinPer100g: 12, carbsPer100g: 5, fatPer100g: 11, defaultServingG: 200, servingUnit: '份' },
  { name: '木须肉', category: '家常菜', aliases: ['木樨肉', '苜蓿肉'], caloriesPer100g: 175, proteinPer100g: 11, carbsPer100g: 6, fatPer100g: 12, defaultServingG: 200, servingUnit: '份' },
  { name: '京酱肉丝', category: '家常菜', caloriesPer100g: 190, proteinPer100g: 14, carbsPer100g: 8, fatPer100g: 12, defaultServingG: 180, servingUnit: '份' },
  { name: '蚂蚁上树', category: '家常菜', aliases: ['粉丝肉末'], caloriesPer100g: 140, proteinPer100g: 8, carbsPer100g: 14, fatPer100g: 6, defaultServingG: 220, servingUnit: '份' },
  { name: '红烧茄子', category: '家常菜', caloriesPer100g: 95, proteinPer100g: 2, carbsPer100g: 10, fatPer100g: 6, defaultServingG: 200, servingUnit: '份' },
  { name: '地三鲜', category: '家常菜', caloriesPer100g: 110, proteinPer100g: 3, carbsPer100g: 12, fatPer100g: 6, defaultServingG: 250, servingUnit: '份' },
  { name: '干煸四季豆', category: '家常菜', aliases: ['干煸豆角'], caloriesPer100g: 88, proteinPer100g: 4, carbsPer100g: 9, fatPer100g: 5, defaultServingG: 200, servingUnit: '份' },
  { name: '蒜蓉西兰花', category: '家常菜', aliases: ['清炒西兰花', '西兰花'], caloriesPer100g: 55, proteinPer100g: 4, carbsPer100g: 6, fatPer100g: 2, defaultServingG: 180, servingUnit: '份' },
  { name: '蚝油生菜', category: '家常菜', aliases: ['生菜'], caloriesPer100g: 45, proteinPer100g: 2, carbsPer100g: 5, fatPer100g: 2, defaultServingG: 150, servingUnit: '份' },
  { name: '糖醋排骨', category: '家常菜', caloriesPer100g: 265, proteinPer100g: 16, carbsPer100g: 14, fatPer100g: 17, defaultServingG: 180, servingUnit: '份' },
  { name: '蒜香排骨', category: '家常菜', caloriesPer100g: 255, proteinPer100g: 17, carbsPer100g: 5, fatPer100g: 19, defaultServingG: 180, servingUnit: '份' },
  { name: '葱爆羊肉', category: '家常菜', caloriesPer100g: 210, proteinPer100g: 18, carbsPer100g: 3, fatPer100g: 14, defaultServingG: 180, servingUnit: '份' },
  { name: '啤酒鸭', category: '家常菜', caloriesPer100g: 195, proteinPer100g: 16, carbsPer100g: 4, fatPer100g: 13, defaultServingG: 220, servingUnit: '份' },
  { name: '小鸡炖蘑菇', category: '东北菜', caloriesPer100g: 125, proteinPer100g: 14, carbsPer100g: 5, fatPer100g: 6, defaultServingG: 350, servingUnit: '份' },
  { name: '东北乱炖', category: '东北菜', caloriesPer100g: 95, proteinPer100g: 6, carbsPer100g: 10, fatPer100g: 4, defaultServingG: 400, servingUnit: '份' },
  { name: '锅包肉', category: '东北菜', aliases: ['锅爆肉'], caloriesPer100g: 235, proteinPer100g: 12, carbsPer100g: 22, fatPer100g: 12, defaultServingG: 200, servingUnit: '份' },

  // —— 川菜 / 湘菜 ——
  { name: '水煮鱼', category: '川菜', aliases: ['水煮鱼片'], caloriesPer100g: 145, proteinPer100g: 15, carbsPer100g: 3, fatPer100g: 9, defaultServingG: 350, servingUnit: '份' },
  { name: '酸菜鱼', category: '川菜', caloriesPer100g: 130, proteinPer100g: 14, carbsPer100g: 4, fatPer100g: 7, defaultServingG: 400, servingUnit: '份' },
  { name: '口水鸡', category: '川菜', caloriesPer100g: 175, proteinPer100g: 20, carbsPer100g: 3, fatPer100g: 10, defaultServingG: 180, servingUnit: '份' },
  { name: '辣子鸡', category: '川菜', caloriesPer100g: 210, proteinPer100g: 18, carbsPer100g: 6, fatPer100g: 13, defaultServingG: 200, servingUnit: '份' },
  { name: '夫妻肺片', category: '川菜', caloriesPer100g: 165, proteinPer100g: 16, carbsPer100g: 4, fatPer100g: 10, defaultServingG: 150, servingUnit: '份' },
  { name: '毛血旺', category: '川菜', caloriesPer100g: 155, proteinPer100g: 12, carbsPer100g: 6, fatPer100g: 10, defaultServingG: 400, servingUnit: '份' },
  { name: '鱼香茄子', category: '川菜', caloriesPer100g: 92, proteinPer100g: 2, carbsPer100g: 11, fatPer100g: 5, defaultServingG: 220, servingUnit: '份' },
  { name: '剁椒鱼头', category: '湘菜', caloriesPer100g: 140, proteinPer100g: 16, carbsPer100g: 3, fatPer100g: 8, defaultServingG: 350, servingUnit: '份' },
  { name: '农家小炒肉', category: '湘菜', aliases: ['小炒肉'], caloriesPer100g: 245, proteinPer100g: 14, carbsPer100g: 4, fatPer100g: 19, defaultServingG: 180, servingUnit: '份' },

  // —— 粤菜 ——
  { name: '白切鸡', category: '粤菜', aliases: ['白斩鸡'], caloriesPer100g: 165, proteinPer100g: 22, carbsPer100g: 0, fatPer100g: 8, defaultServingG: 200, servingUnit: '份' },
  { name: '三杯鸡', category: '粤菜', caloriesPer100g: 185, proteinPer100g: 19, carbsPer100g: 5, fatPer100g: 11, defaultServingG: 220, servingUnit: '份' },
  { name: '白灼虾', category: '粤菜', aliases: ['白灼基围虾', '水煮虾'], caloriesPer100g: 95, proteinPer100g: 20, carbsPer100g: 1, fatPer100g: 1, defaultServingG: 200, servingUnit: '份' },
  { name: '豉汁蒸排骨', category: '粤菜', aliases: ['蒸排骨', '排骨'], caloriesPer100g: 220, proteinPer100g: 16, carbsPer100g: 4, fatPer100g: 16, defaultServingG: 180, servingUnit: '份' },
  { name: '煲仔饭', category: '粤菜', aliases: ['腊味煲仔饭'], caloriesPer100g: 175, proteinPer100g: 8, carbsPer100g: 28, fatPer100g: 5, defaultServingG: 400, servingUnit: '份' },
  { name: '叉烧', category: '粤菜', aliases: ['叉烧肉', '蜜汁叉烧'], caloriesPer100g: 280, proteinPer100g: 18, carbsPer100g: 12, fatPer100g: 18, defaultServingG: 150, servingUnit: '份' },
  { name: '虾饺', category: '粤菜', caloriesPer100g: 195, proteinPer100g: 10, carbsPer100g: 24, fatPer100g: 7, defaultServingG: 120, servingUnit: '份' },
  { name: '肠粉', category: '粤菜', aliases: ['牛肉肠粉', '鲜虾肠粉'], caloriesPer100g: 130, proteinPer100g: 5, carbsPer100g: 22, fatPer100g: 3, defaultServingG: 250, servingUnit: '份' },

  // —— 主食 / 面点 ——
  { name: '蛋炒饭', category: '主食', aliases: ['炒饭', '鸡蛋炒饭'], caloriesPer100g: 165, proteinPer100g: 5, carbsPer100g: 26, fatPer100g: 5, defaultServingG: 300, servingUnit: '碗' },
  { name: '扬州炒饭', category: '主食', caloriesPer100g: 175, proteinPer100g: 7, carbsPer100g: 25, fatPer100g: 6, defaultServingG: 320, servingUnit: '碗' },
  { name: '炒河粉', category: '主食', aliases: ['干炒牛河', '牛河'], caloriesPer100g: 185, proteinPer100g: 7, carbsPer100g: 28, fatPer100g: 6, defaultServingG: 350, servingUnit: '份' },
  { name: '炒面', category: '主食', aliases: ['家常炒面'], caloriesPer100g: 170, proteinPer100g: 6, carbsPer100g: 27, fatPer100g: 5, defaultServingG: 350, servingUnit: '份' },
  { name: '炸酱面', category: '主食', aliases: ['老北京炸酱面'], caloriesPer100g: 155, proteinPer100g: 8, carbsPer100g: 22, fatPer100g: 5, defaultServingG: 400, servingUnit: '碗' },
  { name: '重庆小面', category: '主食', aliases: ['小面'], caloriesPer100g: 140, proteinPer100g: 6, carbsPer100g: 20, fatPer100g: 5, defaultServingG: 400, servingUnit: '碗' },
  { name: '热干面', category: '主食', caloriesPer100g: 165, proteinPer100g: 7, carbsPer100g: 24, fatPer100g: 5, defaultServingG: 350, servingUnit: '碗' },
  { name: '烩面', category: '主食', aliases: ['羊肉烩面', '牛肉烩面'], caloriesPer100g: 135, proteinPer100g: 7, carbsPer100g: 20, fatPer100g: 4, defaultServingG: 500, servingUnit: '碗' },
  { name: '担担面', category: '主食', caloriesPer100g: 175, proteinPer100g: 8, carbsPer100g: 22, fatPer100g: 7, defaultServingG: 350, servingUnit: '碗' },
  { name: '米线', category: '主食', aliases: ['过桥米线', '云南米线'], caloriesPer100g: 95, proteinPer100g: 4, carbsPer100g: 16, fatPer100g: 2, defaultServingG: 450, servingUnit: '碗' },
  { name: '螺蛳粉', category: '主食', caloriesPer100g: 125, proteinPer100g: 5, carbsPer100g: 18, fatPer100g: 4, defaultServingG: 450, servingUnit: '碗' },
  { name: '饺子', category: '主食', aliases: ['水饺', '猪肉饺子'], caloriesPer100g: 220, proteinPer100g: 9, carbsPer100g: 28, fatPer100g: 9, defaultServingG: 250, servingUnit: '份' },
  { name: '馄饨', category: '主食', aliases: ['云吞', '鲜肉馄饨'], caloriesPer100g: 165, proteinPer100g: 8, carbsPer100g: 22, fatPer100g: 5, defaultServingG: 350, servingUnit: '碗' },
  { name: '小笼包', category: '主食', aliases: ['灌汤包'], caloriesPer100g: 230, proteinPer100g: 9, carbsPer100g: 30, fatPer100g: 9, defaultServingG: 150, servingUnit: '份' },
  { name: '包子', category: '主食', aliases: ['肉包', '菜包'], caloriesPer100g: 215, proteinPer100g: 8, carbsPer100g: 32, fatPer100g: 7, defaultServingG: 120, servingUnit: '个' },
  { name: '馒头', category: '主食', caloriesPer100g: 223, proteinPer100g: 7, carbsPer100g: 47, fatPer100g: 1, defaultServingG: 100, servingUnit: '个' },
  { name: '花卷', category: '主食', caloriesPer100g: 235, proteinPer100g: 7, carbsPer100g: 45, fatPer100g: 3, defaultServingG: 80, servingUnit: '个' },
  { name: '油条', category: '早餐', caloriesPer100g: 385, proteinPer100g: 7, carbsPer100g: 42, fatPer100g: 22, defaultServingG: 80, servingUnit: '根' },
  { name: '豆浆', category: '早餐', caloriesPer100g: 35, proteinPer100g: 3, carbsPer100g: 2, fatPer100g: 2, defaultServingG: 300, servingUnit: '杯' },
  { name: '皮蛋瘦肉粥', category: '早餐', aliases: ['瘦肉粥', '咸粥'], caloriesPer100g: 55, proteinPer100g: 4, carbsPer100g: 8, fatPer100g: 1, defaultServingG: 400, servingUnit: '碗' },
  { name: '小米粥', category: '早餐', aliases: ['白粥', '大米粥'], caloriesPer100g: 46, proteinPer100g: 1.5, carbsPer100g: 9, fatPer100g: 0.5, defaultServingG: 350, servingUnit: '碗' },
  { name: '煎饼果子', category: '早餐', aliases: ['煎饼'], caloriesPer100g: 245, proteinPer100g: 8, carbsPer100g: 32, fatPer100g: 10, defaultServingG: 200, servingUnit: '个' },
  { name: '肉夹馍', category: '小吃', caloriesPer100g: 265, proteinPer100g: 12, carbsPer100g: 30, fatPer100g: 11, defaultServingG: 180, servingUnit: '个' },
  { name: '手抓饼', category: '早餐', caloriesPer100g: 290, proteinPer100g: 7, carbsPer100g: 35, fatPer100g: 14, defaultServingG: 150, servingUnit: '个' },

  // —— 汤品 ——
  { name: '紫菜蛋花汤', category: '汤品', aliases: ['蛋花汤'], caloriesPer100g: 35, proteinPer100g: 3, carbsPer100g: 2, fatPer100g: 2, defaultServingG: 300, servingUnit: '碗' },
  { name: '酸辣汤', category: '汤品', caloriesPer100g: 45, proteinPer100g: 3, carbsPer100g: 5, fatPer100g: 2, defaultServingG: 300, servingUnit: '碗' },
  { name: '西红柿鸡蛋汤', category: '汤品', aliases: ['番茄蛋汤'], caloriesPer100g: 40, proteinPer100g: 3, carbsPer100g: 4, fatPer100g: 2, defaultServingG: 300, servingUnit: '碗' },
  { name: '冬瓜排骨汤', category: '汤品', aliases: ['排骨冬瓜汤'], caloriesPer100g: 55, proteinPer100g: 5, carbsPer100g: 3, fatPer100g: 3, defaultServingG: 350, servingUnit: '碗' },
  { name: '老鸭汤', category: '汤品', aliases: ['老鸭粉丝汤'], caloriesPer100g: 75, proteinPer100g: 7, carbsPer100g: 4, fatPer100g: 4, defaultServingG: 400, servingUnit: '碗' },

  // —— 凉菜 / 小吃 ——
  { name: '凉皮', category: '小吃', caloriesPer100g: 130, proteinPer100g: 4, carbsPer100g: 24, fatPer100g: 2, defaultServingG: 300, servingUnit: '份' },
  { name: '凉拌黄瓜', category: '凉菜', aliases: ['拍黄瓜'], caloriesPer100g: 25, proteinPer100g: 1, carbsPer100g: 4, fatPer100g: 0.5, defaultServingG: 150, servingUnit: '份' },
  { name: '卤味拼盘', category: '小吃', aliases: ['卤菜', '卤味'], caloriesPer100g: 195, proteinPer100g: 18, carbsPer100g: 5, fatPer100g: 12, defaultServingG: 150, servingUnit: '份' },
  { name: '烤红薯', category: '小吃', aliases: ['红薯', '地瓜'], caloriesPer100g: 90, proteinPer100g: 2, carbsPer100g: 21, fatPer100g: 0.2, defaultServingG: 200, servingUnit: '个' },
  { name: '糖葫芦', category: '小吃', caloriesPer100g: 180, proteinPer100g: 0.5, carbsPer100g: 45, fatPer100g: 0.5, defaultServingG: 80, servingUnit: '串' },
  { name: '臭豆腐', category: '小吃', caloriesPer100g: 195, proteinPer100g: 12, carbsPer100g: 8, fatPer100g: 14, defaultServingG: 120, servingUnit: '份' },
  { name: '煎饼', category: '小吃', aliases: ['鸡蛋煎饼'], caloriesPer100g: 230, proteinPer100g: 8, carbsPer100g: 30, fatPer100g: 9, defaultServingG: 150, servingUnit: '个' },

  // —— 火锅 / 烧烤 ——
  { name: '火锅（红汤）', category: '火锅', aliases: ['麻辣火锅', '牛油火锅'], caloriesPer100g: 120, proteinPer100g: 8, carbsPer100g: 6, fatPer100g: 8, defaultServingG: 500, servingUnit: '份' },
  { name: '火锅（清汤）', category: '火锅', aliases: ['清汤锅'], caloriesPer100g: 85, proteinPer100g: 9, carbsPer100g: 4, fatPer100g: 4, defaultServingG: 500, servingUnit: '份' },
  { name: '烤羊肉串', category: '烧烤', aliases: ['羊肉串', '烤肉串'], caloriesPer100g: 265, proteinPer100g: 20, carbsPer100g: 2, fatPer100g: 20, defaultServingG: 150, servingUnit: '份' },
  { name: '烤鱼', category: '烧烤', aliases: ['万州烤鱼'], caloriesPer100g: 155, proteinPer100g: 16, carbsPer100g: 5, fatPer100g: 9, defaultServingG: 400, servingUnit: '份' },
  { name: '烤鸡翅', category: '烧烤', aliases: ['鸡翅', '奥尔良鸡翅'], caloriesPer100g: 215, proteinPer100g: 18, carbsPer100g: 3, fatPer100g: 15, defaultServingG: 150, servingUnit: '份' },

  // —— 甜品 / 饮品 ——
  { name: '蛋挞', category: '甜品', caloriesPer100g: 380, proteinPer100g: 5, carbsPer100g: 35, fatPer100g: 24, defaultServingG: 60, servingUnit: '个' },
  { name: '红豆沙', category: '甜品', caloriesPer100g: 120, proteinPer100g: 4, carbsPer100g: 24, fatPer100g: 1, defaultServingG: 200, servingUnit: '碗' },
  { name: '绿豆汤', category: '甜品', caloriesPer100g: 55, proteinPer100g: 3, carbsPer100g: 10, fatPer100g: 0.5, defaultServingG: 300, servingUnit: '碗' },
  { name: '双皮奶', category: '甜品', caloriesPer100g: 145, proteinPer100g: 4, carbsPer100g: 18, fatPer100g: 7, defaultServingG: 150, servingUnit: '碗' },
  { name: '珍珠奶茶', category: '饮品', aliases: ['奶茶', '波霸奶茶'], caloriesPer100g: 65, proteinPer100g: 1, carbsPer100g: 12, fatPer100g: 2, defaultServingG: 500, servingUnit: '杯' },
  { name: '酸梅汤', category: '饮品', caloriesPer100g: 40, proteinPer100g: 0.2, carbsPer100g: 10, fatPer100g: 0, defaultServingG: 350, servingUnit: '杯' },

  // —— 常见配菜 / 蛋白 ——
  { name: '炒青菜', category: '家常菜', aliases: ['时蔬', '清炒蔬菜', '炒时蔬'], caloriesPer100g: 42, proteinPer100g: 2, carbsPer100g: 5, fatPer100g: 2, defaultServingG: 150, servingUnit: '份' },
  { name: '土豆丝', category: '家常菜', aliases: ['酸辣土豆丝', '炒土豆丝'], caloriesPer100g: 95, proteinPer100g: 2, carbsPer100g: 15, fatPer100g: 3, defaultServingG: 180, servingUnit: '份' },
  { name: '麻酱凉皮', category: '小吃', caloriesPer100g: 155, proteinPer100g: 5, carbsPer100g: 22, fatPer100g: 5, defaultServingG: 300, servingUnit: '份' },
  { name: '烧卖', category: '粤菜', aliases: ['烧麦'], caloriesPer100g: 210, proteinPer100g: 9, carbsPer100g: 26, fatPer100g: 8, defaultServingG: 120, servingUnit: '份' },
  { name: '春卷', category: '小吃', caloriesPer100g: 245, proteinPer100g: 6, carbsPer100g: 28, fatPer100g: 12, defaultServingG: 100, servingUnit: '份' },
  { name: '锅贴', category: '小吃', aliases: ['煎饺'], caloriesPer100g: 235, proteinPer100g: 9, carbsPer100g: 28, fatPer100g: 10, defaultServingG: 150, servingUnit: '份' },
  { name: '葱油饼', category: '主食', caloriesPer100g: 310, proteinPer100g: 6, carbsPer100g: 38, fatPer100g: 15, defaultServingG: 120, servingUnit: '张' },
  { name: '炒饭（牛肉）', category: '主食', aliases: ['牛肉炒饭'], caloriesPer100g: 185, proteinPer100g: 9, carbsPer100g: 24, fatPer100g: 7, defaultServingG: 320, servingUnit: '碗' },
  { name: '盖浇饭', category: '主食', aliases: ['盖饭', '快餐盖饭'], caloriesPer100g: 155, proteinPer100g: 7, carbsPer100g: 24, fatPer100g: 4, defaultServingG: 400, servingUnit: '份' },
  { name: '猪脚饭', category: '外卖', aliases: ['隆江猪脚饭', '猪肘饭'], caloriesPer100g: 195, proteinPer100g: 12, carbsPer100g: 18, fatPer100g: 9, defaultServingG: 450, servingUnit: '份' },
  { name: '鸡排饭', category: '外卖', aliases: ['鸡排盖饭'], caloriesPer100g: 210, proteinPer100g: 14, carbsPer100g: 22, fatPer100g: 8, defaultServingG: 420, servingUnit: '份' },
  { name: '麻辣香锅', category: '外卖', caloriesPer100g: 135, proteinPer100g: 8, carbsPer100g: 10, fatPer100g: 8, defaultServingG: 450, servingUnit: '份' },
  { name: '冒菜', category: '川菜', caloriesPer100g: 110, proteinPer100g: 7, carbsPer100g: 9, fatPer100g: 6, defaultServingG: 400, servingUnit: '碗' },
  { name: '串串香', category: '川菜', aliases: ['冷锅串串'], caloriesPer100g: 125, proteinPer100g: 9, carbsPer100g: 8, fatPer100g: 7, defaultServingG: 350, servingUnit: '份' },
];
