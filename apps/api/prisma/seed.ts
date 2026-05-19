import { HealthMode, PrismaClient } from '@prisma/client';

import * as bcrypt from 'bcryptjs';

import { baseFoods } from './seeds/base-foods';

import { chineseFoods } from './seeds/chinese-foods';

import { chineseFoodsMore } from './seeds/chinese-foods-more';

import { chineseRegionalFoods } from './seeds/chinese-regional';

import { fastfoodConvenienceFoods } from './seeds/fastfood-convenience';

import { internationalFoods } from './seeds/international-foods';

import { coarseGrainFoods } from './seeds/coarse-grain-foods';

import { upsertFoods } from './seeds/upsert-foods';



const prisma = new PrismaClient();



const modeConfigs: {

  healthMode: HealthMode;

  label: string;

  config: Record<string, number>;

}[] = [

  {

    healthMode: HealthMode.lose_fat,

    label: '减脂',

    config: { calorieDeficit: 400, proteinPerKg: 1.6 },

  },

  {

    healthMode: HealthMode.gain_muscle,

    label: '增肌塑形',

    config: { calorieDeficit: -300, proteinPerKg: 2.0 },

  },

  {

    healthMode: HealthMode.metabolic,

    label: '代谢管理',

    config: { calorieDeficit: 200, proteinPerKg: 1.4, sodiumMgMax: 2000, sugarGMax: 50 },

  },

  {

    healthMode: HealthMode.pregnancy,

    label: '孕产期',

    config: { calorieDeficit: -200, proteinPerKg: 1.5 },

  },

  {

    healthMode: HealthMode.wellness,

    label: '轻健康',

    config: { calorieDeficit: 0, proteinPerKg: 1.2 },

  },

];



function dedupeFoodsByName<T extends { name: string }>(items: T[]): T[] {

  const map = new Map<string, T>();

  for (const item of items) {

    map.set(item.name, item);

  }

  return [...map.values()];

}



async function main() {

  for (const mode of modeConfigs) {

    await prisma.modeConfig.upsert({

      where: { healthMode: mode.healthMode },

      create: mode,

      update: { label: mode.label, config: mode.config },

    });

  }



  const username = process.env.ADMIN_DEFAULT_USERNAME ?? 'admin';

  const password = process.env.ADMIN_DEFAULT_PASSWORD ?? 'admin123';

  const passwordHash = await bcrypt.hash(password, 10);



  await prisma.admin.upsert({

    where: { username },

    create: { username, passwordHash },

    update: {},

  });



  const catalog = dedupeFoodsByName([
    ...baseFoods,
    ...chineseFoods,
    ...chineseFoodsMore,
    ...chineseRegionalFoods,
    ...fastfoodConvenienceFoods,
    ...internationalFoods,
    ...coarseGrainFoods,
  ]);

  const { created, updated, total } = await upsertFoods(prisma, catalog);



  console.log(

    `Seeded modes, admin (${username}), foods: ${total} catalog (${created} new, ${updated} updated)`,

  );

}



main()

  .catch((e) => {

    console.error(e);

    process.exit(1);

  })

  .finally(() => prisma.$disconnect());


