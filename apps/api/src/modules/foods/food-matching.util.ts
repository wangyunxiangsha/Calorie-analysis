/** 识别/搜索共用的菜名规范化与别名匹配 */

export type FoodLike = {
  name: string;
  aliases?: string[] | null;
};

/** 去掉口语修饰、括号说明，便于匹配 */
export function normalizeFoodText(text: string): string {
  return text
    .trim()
    .replace(/[（）()【】\[\]]/g, ' ')
    .replace(/\s+/g, '')
    .replace(/^(家常|正宗|特色|网红|爆款|秘制|经典|传统|老式)/, '')
    .replace(/(一份|一盘|一碗|一道|半份|大份|小份|套餐)$/, '')
    .trim();
}

const NOISE_STRIP = /肉末|卤蛋|配菜|加蛋|汤面|宽面|细面|微辣|中辣|特辣|少油|多油/g;

type RecognitionRule = {
  pattern: RegExp;
  /** 与食物库 `name` 字段一致 */
  canonicalNames: string[];
  /** 为 true 时仅在未命中其它高置信规则时使用 */
  weak?: boolean;
};

/** 口语 / 模型输出 → 标准菜名 */
export const RECOGNITION_RULES: RecognitionRule[] = [
  { pattern: /刀削|削面/, canonicalNames: ['刀削面'] },
  { pattern: /宽面|宽面汤/, canonicalNames: ['刀削面'] },
  { pattern: /(可乐|cola).*(鸡|翅)|(?:鸡|翅).*(可乐|cola)/i, canonicalNames: ['可乐鸡翅'] },
  { pattern: /宫保/, canonicalNames: ['宫保鸡丁'] },
  { pattern: /鱼香.*肉|鱼香肉丝/, canonicalNames: ['鱼香肉丝'] },
  { pattern: /麻婆|麻婆豆腐/, canonicalNames: ['麻婆豆腐'] },
  { pattern: /番茄.*蛋|西红柿.*蛋/, canonicalNames: ['番茄炒蛋'] },
  { pattern: /红烧.*肉(?!丝)/, canonicalNames: ['红烧肉'] },
  { pattern: /回锅肉/, canonicalNames: ['回锅肉'] },
  { pattern: /糖醋.*里脊|咕噜肉/, canonicalNames: ['糖醋里脊'] },
  { pattern: /水煮鱼|水煮肉片/, canonicalNames: ['水煮鱼'] },
  { pattern: /酸菜鱼/, canonicalNames: ['酸菜鱼'] },
  { pattern: /黄焖鸡/, canonicalNames: ['黄焖鸡米饭'] },
  { pattern: /兰州.*面|牛肉拉面/, canonicalNames: ['兰州牛肉面'] },
  { pattern: /螺蛳粉/, canonicalNames: ['螺蛳粉'] },
  { pattern: /麻辣香锅/, canonicalNames: ['麻辣香锅'] },
  { pattern: /麻辣烫/, canonicalNames: ['麻辣烫（素多）'] },
  { pattern: /猪脚饭|猪肘饭/, canonicalNames: ['猪脚饭'] },
  { pattern: /蛋炒饭|炒饭(?!（)/, canonicalNames: ['蛋炒饭'] },
  { pattern: /干炒牛河|牛河/, canonicalNames: ['炒河粉'] },
  { pattern: /小笼包|灌汤包/, canonicalNames: ['小笼包'] },
  { pattern: /烤翅|奥尔良/, canonicalNames: ['烤鸡翅'] },
  { pattern: /羊肉串|烤肉串/, canonicalNames: ['烤羊肉串'] },
  { pattern: /万州烤鱼|烤鱼(?!片)/, canonicalNames: ['烤鱼'] },
  { pattern: /白切鸡|白斩鸡/, canonicalNames: ['白切鸡'] },
  { pattern: /叉烧/, canonicalNames: ['叉烧'] },
  { pattern: /煲仔饭/, canonicalNames: ['煲仔饭'] },
  { pattern: /皮蛋瘦肉粥|瘦肉粥/, canonicalNames: ['皮蛋瘦肉粥'] },
  { pattern: /白米饭|米饭(?!炒)/, canonicalNames: ['白米饭'] },
  { pattern: /拿铁|latte/i, canonicalNames: ['瑞幸拿铁'] },
  { pattern: /东坡肉/, canonicalNames: ['东坡肉', '红烧肉'] },
  { pattern: /大盘鸡/, canonicalNames: ['大盘鸡'] },
  { pattern: /肉夹馍/, canonicalNames: ['肉夹馍'] },
  { pattern: /胡辣汤/, canonicalNames: ['胡辣汤'] },
  { pattern: /豆腐脑|豆花/, canonicalNames: ['豆腐脑'] },
  { pattern: /钵钵鸡/, canonicalNames: ['钵钵鸡'] },
  { pattern: /烤冷面/, canonicalNames: ['烤冷面'] },
  { pattern: /鸡翅|鸡翼|chicken wing/i, canonicalNames: ['可乐鸡翅'], weak: true },
  { pattern: /烤鸭|北京鸭/, canonicalNames: ['北京烤鸭'] },
  { pattern: /小龙虾|口味虾/, canonicalNames: ['口味虾'] },
  { pattern: /寿司|sushi/i, canonicalNames: ['寿司拼盘'] },
  { pattern: /刺身|sashimi/i, canonicalNames: ['三文鱼刺身'] },
  { pattern: /拉面|ramen|豚骨/, canonicalNames: ['日式拉面', '兰州牛肉面'] },
  { pattern: /石锅拌饭|bibimbap/i, canonicalNames: ['石锅拌饭'] },
  { pattern: /韩式炸鸡|韩国炸鸡/, canonicalNames: ['韩式炸鸡', '肯德基原味鸡'] },
  { pattern: /披萨|比萨|pizza/i, canonicalNames: ['必胜客披萨（芝士）', '达美乐披萨'] },
  { pattern: /汉堡|burger/i, canonicalNames: ['牛肉汉堡', '麦当劳巨无霸'] },
  { pattern: /巨无霸|big\s*mac/i, canonicalNames: ['麦当劳巨无霸'] },
  { pattern: /麦辣|麦乐鸡|nugget/i, canonicalNames: ['麦当劳麦辣鸡腿堡', '麦当劳麦乐鸡'] },
  { pattern: /全家.*便当|全家饭团/, canonicalNames: ['全家咖喱鸡排饭', '全家奥尔良饭团'] },
  { pattern: /罗森.*便当|罗森饭团/, canonicalNames: ['罗森照烧鸡排饭', '罗森三文鱼饭团'] },
  { pattern: /7-?11|seven\s*eleven/, canonicalNames: ['7-11鱼籽拌饭', '7-11蒲烧鳗鱼饭'] },
  { pattern: /牛排|steak/i, canonicalNames: ['牛排（西冷）'] },
  { pattern: /冬阴功|tom\s*yum/i, canonicalNames: ['冬阴功汤'] },
  { pattern: /河粉|pho/i, canonicalNames: ['越南河粉', '炒河粉'] },
  { pattern: /咖喱(?!鸡丁)/, canonicalNames: ['印度咖喱鸡', '日式咖喱饭'] },
  { pattern: /莜面|栲栳栳|搓鱼/, canonicalNames: ['莜面鱼鱼', '莜面栲栳栳', '莜面饸饹'] },
  { pattern: /豆面|豌豆面|绿豆面/, canonicalNames: ['豆面饸饹', '豌豆面饸饹', '绿豆面煎饼'] },
  { pattern: /玉米面|棒子面|窝窝头|贴饼子/, canonicalNames: ['玉米面条', '玉米面窝头', '玉米面饼', '玉米面糊'] },
  { pattern: /荞麦|荞面/, canonicalNames: ['荞麦面', '荞麦馒头'] },
  { pattern: /杂粮饭|五谷饭|糙米饭/, canonicalNames: ['杂粮饭'] },
];

/** 视觉模型返回长句时拆成可检索 token */
export function expandSearchTokens(raw: string): string[] {
  const text = raw.trim();
  const tokens = new Set<string>();

  const normalized = normalizeFoodText(text);
  if (normalized.length >= 2) tokens.add(normalized);

  text
    .replace(/[（）()]/g, ' ')
    .split(/[、，,\s·/]+/)
    .map((s) => normalizeFoodText(s))
    .filter((s) => s.length >= 2)
    .forEach((s) => tokens.add(s));

  const strongHits = new Set<string>();
  for (const rule of RECOGNITION_RULES) {
    if (!rule.pattern.test(text)) continue;
    for (const name of rule.canonicalNames) {
      if (rule.weak) continue;
      strongHits.add(name);
      tokens.add(name);
    }
  }
  for (const rule of RECOGNITION_RULES) {
    if (!rule.weak || !rule.pattern.test(text)) continue;
    for (const name of rule.canonicalNames) {
      if (!strongHits.has(name)) tokens.add(name);
    }
  }

  const stripped = normalizeFoodText(text.replace(NOISE_STRIP, ''));
  if (stripped.length >= 2) tokens.add(stripped);

  return [...tokens];
}

export function scoreFoodMatch(raw: string, food: FoodLike): number {
  const text = normalizeFoodText(raw);
  if (!text) return 0;

  const name = normalizeFoodText(food.name);
  let score = 0;

  if (text === name) score = Math.max(score, 12);
  else if (text.includes(name) || name.includes(text)) score = Math.max(score, 10);

  for (const alias of food.aliases ?? []) {
    const a = normalizeFoodText(alias);
    if (!a || a.length < 2) continue;
    if (text === a) score = Math.max(score, 11);
    else if (text.includes(a) || a.includes(text)) score = Math.max(score, 9);
  }

  for (const rule of RECOGNITION_RULES) {
    if (!rule.pattern.test(raw)) continue;
    if (rule.canonicalNames.includes(food.name)) {
      score = Math.max(score, rule.weak ? 7 : 8);
    }
  }

  return score;
}

export { mergeAliasList } from '../../../prisma/seeds/seed-alias.util';
