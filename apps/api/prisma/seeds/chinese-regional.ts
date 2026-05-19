import type { FoodSeed } from './food-types';

/** 八大菜系及地方菜补全（不含已在其它种子文件中的菜名） */
export const chineseRegionalFoods: FoodSeed[] = [
  // 京菜 / 津菜
  { name: '北京烤鸭', category: '京菜', aliases: ['烤鸭', '片皮鸭', '全聚德烤鸭'], caloriesPer100g: 240, proteinPer100g: 19, carbsPer100g: 2, fatPer100g: 18, defaultServingG: 200, servingUnit: '份' },
  { name: '涮羊肉', category: '京菜', aliases: ['老北京涮肉', '铜锅涮肉'], caloriesPer100g: 195, proteinPer100g: 18, carbsPer100g: 2, fatPer100g: 13, defaultServingG: 250, servingUnit: '份' },
  { name: '驴打滚', category: '京菜', caloriesPer100g: 285, proteinPer100g: 4, carbsPer100g: 52, fatPer100g: 7, defaultServingG: 80, servingUnit: '份' },
  { name: '豌豆黄', category: '京菜', caloriesPer100g: 195, proteinPer100g: 5, carbsPer100g: 38, fatPer100g: 3, defaultServingG: 80, servingUnit: '份' },
  { name: '狗不理包子', category: '津菜', aliases: ['天津包子'], caloriesPer100g: 225, proteinPer100g: 8, carbsPer100g: 32, fatPer100g: 8, defaultServingG: 120, servingUnit: '个' },
  { name: '煎饼馃子', category: '津菜', aliases: ['天津煎饼'], caloriesPer100g: 250, proteinPer100g: 8, carbsPer100g: 33, fatPer100g: 10, defaultServingG: 200, servingUnit: '个' },

  // 苏菜 / 淮扬
  { name: '松鼠桂鱼', category: '苏菜', caloriesPer100g: 185, proteinPer100g: 15, carbsPer100g: 14, fatPer100g: 9, defaultServingG: 280, servingUnit: '份' },
  { name: '清炖狮子头', category: '苏菜', aliases: ['狮子头', '红烧狮子头'], caloriesPer100g: 220, proteinPer100g: 12, carbsPer100g: 6, fatPer100g: 17, defaultServingG: 200, servingUnit: '份' },
  { name: '盐水鸭', category: '苏菜', aliases: ['南京盐水鸭'], caloriesPer100g: 195, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 12, defaultServingG: 180, servingUnit: '份' },
  { name: '大煮干丝', category: '淮扬菜', caloriesPer100g: 75, proteinPer100g: 8, carbsPer100g: 4, fatPer100g: 3, defaultServingG: 250, servingUnit: '份' },
  { name: '蟹粉小笼', category: '苏菜', aliases: ['蟹黄小笼', '蟹粉汤包'], caloriesPer100g: 245, proteinPer100g: 10, carbsPer100g: 28, fatPer100g: 11, defaultServingG: 150, servingUnit: '份' },
  { name: '无锡排骨', category: '苏菜', aliases: ['酱排骨'], caloriesPer100g: 275, proteinPer100g: 15, carbsPer100g: 12, fatPer100g: 20, defaultServingG: 180, servingUnit: '份' },

  // 鄂菜 / 豫菜 / 赣菜
  { name: '武昌鱼', category: '鄂菜', aliases: ['清蒸武昌鱼'], caloriesPer100g: 115, proteinPer100g: 18, carbsPer100g: 0, fatPer100g: 4, defaultServingG: 300, servingUnit: '份' },
  { name: '瓦罐汤', category: '赣菜', caloriesPer100g: 48, proteinPer100g: 4, carbsPer100g: 4, fatPer100g: 2, defaultServingG: 300, servingUnit: '碗' },
  { name: '粉蒸肉', category: '赣菜', aliases: ['米粉蒸肉'], caloriesPer100g: 275, proteinPer100g: 11, carbsPer100g: 18, fatPer100g: 19, defaultServingG: 180, servingUnit: '份' },
  { name: '三杯鸡（赣南）', category: '赣菜', caloriesPer100g: 180, proteinPer100g: 18, carbsPer100g: 5, fatPer100g: 10, defaultServingG: 220, servingUnit: '份' },

  // 滇菜 / 黔菜 / 桂菜
  { name: '汽锅鸡', category: '滇菜', caloriesPer100g: 95, proteinPer100g: 16, carbsPer100g: 1, fatPer100g: 3, defaultServingG: 350, servingUnit: '份' },
  { name: '鲜花饼', category: '滇菜', caloriesPer100g: 385, proteinPer100g: 5, carbsPer100g: 55, fatPer100g: 16, defaultServingG: 60, servingUnit: '个' },
  { name: '酸汤鱼', category: '黔菜', aliases: ['贵州酸汤鱼', '凯里酸汤鱼'], caloriesPer100g: 125, proteinPer100g: 15, carbsPer100g: 4, fatPer100g: 6, defaultServingG: 350, servingUnit: '份' },
  { name: '丝娃娃', category: '黔菜', caloriesPer100g: 95, proteinPer100g: 4, carbsPer100g: 14, fatPer100g: 3, defaultServingG: 200, servingUnit: '份' },
  { name: '桂林米粉', category: '桂菜', aliases: ['卤菜粉', '桂林卤粉'], caloriesPer100g: 110, proteinPer100g: 5, carbsPer100g: 17, fatPer100g: 3, defaultServingG: 400, servingUnit: '碗' },
  { name: '柠檬鸭', category: '桂菜', aliases: ['南宁柠檬鸭'], caloriesPer100g: 175, proteinPer100g: 17, carbsPer100g: 3, fatPer100g: 11, defaultServingG: 250, servingUnit: '份' },

  // 闽菜 / 台菜
  { name: '沙县扁肉', category: '闽菜', aliases: ['扁肉', '沙县馄饨'], caloriesPer100g: 160, proteinPer100g: 9, carbsPer100g: 18, fatPer100g: 6, defaultServingG: 250, servingUnit: '碗' },
  { name: '海蛎煎', category: '闽菜', aliases: ['蚵仔煎'], caloriesPer100g: 175, proteinPer100g: 9, carbsPer100g: 16, fatPer100g: 9, defaultServingG: 200, servingUnit: '份' },
  { name: '土笋冻', category: '闽菜', caloriesPer100g: 45, proteinPer100g: 6, carbsPer100g: 2, fatPer100g: 1, defaultServingG: 150, servingUnit: '份' },
  { name: '卤肉饭', category: '台菜', aliases: ['台湾卤肉饭'], caloriesPer100g: 185, proteinPer100g: 9, carbsPer100g: 22, fatPer100g: 8, defaultServingG: 380, servingUnit: '碗' },
  { name: '盐酥鸡', category: '台菜', aliases: ['台湾盐酥鸡'], caloriesPer100g: 265, proteinPer100g: 18, carbsPer100g: 12, fatPer100g: 17, defaultServingG: 150, servingUnit: '份' },
  { name: '牛肉面（台湾）', category: '台菜', aliases: ['台湾牛肉面'], caloriesPer100g: 145, proteinPer100g: 10, carbsPer100g: 18, fatPer100g: 5, defaultServingG: 500, servingUnit: '碗' },
  { name: '蚵仔面线', category: '台菜', caloriesPer100g: 95, proteinPer100g: 6, carbsPer100g: 14, fatPer100g: 3, defaultServingG: 350, servingUnit: '碗' },

  // 东北 / 内蒙
  { name: '杀猪菜', category: '东北菜', caloriesPer100g: 145, proteinPer100g: 10, carbsPer100g: 6, fatPer100g: 10, defaultServingG: 400, servingUnit: '份' },
  { name: '酸菜白肉', category: '东北菜', aliases: ['酸菜炖白肉'], caloriesPer100g: 165, proteinPer100g: 11, carbsPer100g: 4, fatPer100g: 12, defaultServingG: 350, servingUnit: '份' },
  { name: '铁锅炖', category: '东北菜', aliases: ['铁锅炖大鹅', '铁锅炖鱼'], caloriesPer100g: 135, proteinPer100g: 12, carbsPer100g: 6, fatPer100g: 8, defaultServingG: 450, servingUnit: '份' },
  { name: '粘豆包', category: '东北菜', caloriesPer100g: 235, proteinPer100g: 5, carbsPer100g: 45, fatPer100g: 4, defaultServingG: 100, servingUnit: '个' },
  { name: '烤羊排', category: '内蒙菜', aliases: ['手抓羊排'], caloriesPer100g: 285, proteinPer100g: 22, carbsPer100g: 0, fatPer100g: 22, defaultServingG: 200, servingUnit: '份' },
  { name: '奶茶（咸）', category: '内蒙菜', aliases: ['蒙古奶茶', '咸奶茶'], caloriesPer100g: 55, proteinPer100g: 2, carbsPer100g: 4, fatPer100g: 4, defaultServingG: 300, servingUnit: '杯' },

  // 新疆
  { name: '手抓饭', category: '新疆菜', aliases: ['抓饭', '羊肉抓饭'], caloriesPer100g: 175, proteinPer100g: 9, carbsPer100g: 24, fatPer100g: 6, defaultServingG: 400, servingUnit: '份' },
  { name: '烤包子', category: '新疆菜', aliases: ['新疆烤包子'], caloriesPer100g: 265, proteinPer100g: 11, carbsPer100g: 28, fatPer100g: 12, defaultServingG: 120, servingUnit: '个' },
  { name: '馕', category: '新疆菜', aliases: ['新疆馕', '烤馕'], caloriesPer100g: 295, proteinPer100g: 9, carbsPer100g: 48, fatPer100g: 8, defaultServingG: 100, servingUnit: '个' },
  { name: '红柳烤肉', category: '新疆菜', aliases: ['红柳羊肉串'], caloriesPer100g: 270, proteinPer100g: 21, carbsPer100g: 2, fatPer100g: 20, defaultServingG: 150, servingUnit: '份' },

  // 粤菜补
  { name: '老火靓汤', category: '粤菜', aliases: ['煲汤', '广府汤'], caloriesPer100g: 42, proteinPer100g: 3, carbsPer100g: 3, fatPer100g: 2, defaultServingG: 350, servingUnit: '碗' },
  { name: '烧鹅', category: '粤菜', aliases: ['深井烧鹅', '广式烧鹅'], caloriesPer100g: 305, proteinPer100g: 19, carbsPer100g: 3, fatPer100g: 25, defaultServingG: 180, servingUnit: '份' },
  { name: '艇仔粥', category: '粤菜', caloriesPer100g: 62, proteinPer100g: 4, carbsPer100g: 9, fatPer100g: 2, defaultServingG: 400, servingUnit: '碗' },
  { name: '姜葱炒蟹', category: '粤菜', aliases: ['炒蟹'], caloriesPer100g: 135, proteinPer100g: 17, carbsPer100g: 3, fatPer100g: 7, defaultServingG: 250, servingUnit: '份' },
  { name: '陈皮鸭', category: '粤菜', caloriesPer100g: 210, proteinPer100g: 20, carbsPer100g: 4, fatPer100g: 13, defaultServingG: 200, servingUnit: '份' },

  // 川菜补
  { name: '蒜泥白肉', category: '川菜', caloriesPer100g: 285, proteinPer100g: 14, carbsPer100g: 3, fatPer100g: 24, defaultServingG: 150, servingUnit: '份' },
  { name: '宫保虾球', category: '川菜', aliases: ['宫保虾仁'], caloriesPer100g: 155, proteinPer100g: 16, carbsPer100g: 8, fatPer100g: 7, defaultServingG: 200, servingUnit: '份' },
  { name: '开水白菜', category: '川菜', caloriesPer100g: 25, proteinPer100g: 2, carbsPer100g: 3, fatPer100g: 1, defaultServingG: 200, servingUnit: '份' },
  { name: '钟水饺', category: '川菜', caloriesPer100g: 195, proteinPer100g: 7, carbsPer100g: 28, fatPer100g: 7, defaultServingG: 200, servingUnit: '份' },
  { name: '龙抄手', category: '川菜', aliases: ['红油抄手'], caloriesPer100g: 175, proteinPer100g: 8, carbsPer100g: 22, fatPer100g: 7, defaultServingG: 250, servingUnit: '碗' },
  { name: '燃面', category: '川菜', aliases: ['宜宾燃面'], caloriesPer100g: 185, proteinPer100g: 7, carbsPer100g: 26, fatPer100g: 7, defaultServingG: 350, servingUnit: '碗' },

  // 湘菜补
  { name: '臭豆腐（长沙）', category: '湘菜', aliases: ['长沙臭豆腐', '黑色经典'], caloriesPer100g: 195, proteinPer100g: 12, carbsPer100g: 8, fatPer100g: 14, defaultServingG: 120, servingUnit: '份' },
  { name: '口味虾', category: '湘菜', aliases: ['麻辣小龙虾', '十三香小龙虾', '小龙虾'], caloriesPer100g: 95, proteinPer100g: 17, carbsPer100g: 2, fatPer100g: 2, defaultServingG: 350, servingUnit: '份' },
  { name: '腊味合蒸', category: '湘菜', caloriesPer100g: 285, proteinPer100g: 16, carbsPer100g: 4, fatPer100g: 23, defaultServingG: 200, servingUnit: '份' },
  { name: '永州血鸭', category: '湘菜', aliases: ['血鸭'], caloriesPer100g: 195, proteinPer100g: 17, carbsPer100g: 3, fatPer100g: 13, defaultServingG: 220, servingUnit: '份' },

  // 徽菜 / 浙菜 / 鲁菜
  { name: '毛豆腐', category: '徽菜', caloriesPer100g: 145, proteinPer100g: 12, carbsPer100g: 4, fatPer100g: 10, defaultServingG: 150, servingUnit: '份' },
  { name: '胡适一品锅', category: '徽菜', aliases: ['一品锅'], caloriesPer100g: 125, proteinPer100g: 10, carbsPer100g: 8, fatPer100g: 7, defaultServingG: 350, servingUnit: '份' },
  { name: '龙井虾仁', category: '浙菜', caloriesPer100g: 95, proteinPer100g: 16, carbsPer100g: 2, fatPer100g: 3, defaultServingG: 180, servingUnit: '份' },
  { name: '东坡肘子', category: '浙菜', caloriesPer100g: 295, proteinPer100g: 14, carbsPer100g: 4, fatPer100g: 25, defaultServingG: 200, servingUnit: '份' },
  { name: '叫花鸡', category: '浙菜', caloriesPer100g: 185, proteinPer100g: 21, carbsPer100g: 1, fatPer100g: 11, defaultServingG: 300, servingUnit: '只' },
  { name: '德州扒鸡', category: '鲁菜', aliases: ['扒鸡'], caloriesPer100g: 195, proteinPer100g: 22, carbsPer100g: 1, fatPer100g: 11, defaultServingG: 250, servingUnit: '只' },
  { name: '葱烧海参', category: '鲁菜', caloriesPer100g: 75, proteinPer100g: 12, carbsPer100g: 4, fatPer100g: 2, defaultServingG: 180, servingUnit: '份' },
  { name: '爆炒腰花', category: '鲁菜', caloriesPer100g: 145, proteinPer100g: 16, carbsPer100g: 3, fatPer100g: 8, defaultServingG: 180, servingUnit: '份' },
  // 客家 / 海南
  { name: '酿豆腐', category: '客家菜', aliases: ['客家酿豆腐'], caloriesPer100g: 135, proteinPer100g: 10, carbsPer100g: 6, fatPer100g: 9, defaultServingG: 220, servingUnit: '份' },
  { name: '盐焗鸡', category: '客家菜', aliases: ['客家盐焗鸡'], caloriesPer100g: 195, proteinPer100g: 23, carbsPer100g: 0, fatPer100g: 11, defaultServingG: 200, servingUnit: '份' },
  { name: '文昌鸡', category: '海南菜', aliases: ['海南鸡饭'], caloriesPer100g: 175, proteinPer100g: 22, carbsPer100g: 0, fatPer100g: 9, defaultServingG: 200, servingUnit: '份' },
  { name: '清补凉', category: '海南菜', caloriesPer100g: 85, proteinPer100g: 2, carbsPer100g: 17, fatPer100g: 1, defaultServingG: 250, servingUnit: '碗' },
];
