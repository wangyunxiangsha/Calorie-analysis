import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { FoodsService } from '../foods/foods.service';
import { GoalsService } from '../modes/goals.service';
import { computeDailyIntakeStatus } from '../../utils/intake-status';
import { nutrientsForServing } from '../../utils/nutrition';
import { CreateFoodLogDto } from './dto/create-food-log.dto';

@Injectable()
export class FoodLogsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly foods: FoodsService,
    private readonly goals: GoalsService,
  ) {}

  async create(userId: string, dto: CreateFoodLogDto) {
    const food = await this.foods.findOne(dto.foodId);
    const nutrients = nutrientsForServing(food, dto.servingG);
    const logDate = dto.logDate
      ? new Date(dto.logDate)
      : new Date(new Date().toISOString().slice(0, 10));

    return this.prisma.foodLog.create({
      data: {
        userId,
        foodId: food.id,
        mealType: dto.mealType,
        source: dto.source,
        servingG: dto.servingG,
        logDate,
        calories: nutrients.calories,
        proteinG: nutrients.proteinG,
        carbsG: nutrients.carbsG,
        fatG: nutrients.fatG,
      },
      include: { food: true },
    });
  }

  async dailySummary(userId: string, dateStr?: string) {
    const date = dateStr
      ? new Date(dateStr)
      : new Date(new Date().toISOString().slice(0, 10));

    const logs = await this.prisma.foodLog.findMany({
      where: { userId, logDate: date },
      include: { food: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'asc' },
    });

    const consumed = logs.reduce(
      (acc, log) => ({
        calories: acc.calories + Number(log.calories),
        proteinG: acc.proteinG + Number(log.proteinG),
        carbsG: acc.carbsG + Number(log.carbsG),
        fatG: acc.fatG + Number(log.fatG),
      }),
      { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 },
    );

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { healthMode: true },
    });
    const goal = await this.goals.getActiveGoal(userId);
    const targets = (goal?.targets as Record<string, number> | null) ?? {
      calories: 2000,
      proteinG: 80,
      carbsG: 250,
      fatG: 65,
    };
    const consumedRounded = roundMacros(consumed);
    const intakeStatus = computeDailyIntakeStatus(
      consumedRounded,
      targets as {
        calories: number;
        proteinG: number;
        carbsG: number;
        fatG: number;
      },
      user?.healthMode,
    );

    return {
      date: date.toISOString().slice(0, 10),
      healthMode: user?.healthMode ?? null,
      consumed: consumedRounded,
      targets,
      remaining: {
        calories: round(targets.calories - consumed.calories),
        proteinG: round(targets.proteinG - consumed.proteinG),
        carbsG: round(targets.carbsG - consumed.carbsG),
        fatG: round(targets.fatG - consumed.fatG),
      },
      intakeStatus,
      logs,
    };
  }

  async weeklyTrend(userId: string, daysParam?: string) {
    const days = Math.min(14, Math.max(3, Number(daysParam) || 7));
    const endStr = new Date().toISOString().slice(0, 10);
    const end = new Date(endStr);
    const start = new Date(endStr);
    start.setUTCDate(start.getUTCDate() - (days - 1));

    const grouped = await this.prisma.foodLog.groupBy({
      by: ['logDate'],
      where: {
        userId,
        logDate: { gte: start, lte: end },
      },
      _sum: {
        calories: true,
        proteinG: true,
      },
    });

    const byDate = new Map<string, { calories: number; proteinG: number }>();
    for (const row of grouped) {
      const key = row.logDate.toISOString().slice(0, 10);
      byDate.set(key, {
        calories: Number(row._sum.calories ?? 0),
        proteinG: Number(row._sum.proteinG ?? 0),
      });
    }

    const goal = await this.goals.getActiveGoal(userId);
    const targets = (goal?.targets as Record<string, number> | null) ?? {
      calories: 2000,
      proteinG: 80,
    };

    const series: Array<{
      date: string;
      label: string;
      calories: number;
      proteinG: number;
    }> = [];

    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setUTCDate(start.getUTCDate() + i);
      const date = d.toISOString().slice(0, 10);
      const consumed = byDate.get(date) ?? { calories: 0, proteinG: 0 };
      series.push({
        date,
        label: weekdayLabel(d),
        calories: round(consumed.calories),
        proteinG: round(consumed.proteinG),
      });
    }

    const logged = series.filter((d) => d.calories > 0);
    const sumCal = logged.reduce((a, d) => a + d.calories, 0);
    const sumPro = logged.reduce((a, d) => a + d.proteinG, 0);
    const count = logged.length || 1;

    return {
      days,
      startDate: series[0]?.date,
      endDate: series[series.length - 1]?.date,
      targets: {
        calories: targets.calories,
        proteinG: targets.proteinG,
      },
      series,
      averages: {
        calories: round(sumCal / count),
        proteinG: round(sumPro / count),
      },
      loggedDays: logged.length,
    };
  }
}

function weekdayLabel(d: Date) {
  const labels = ['日', '一', '二', '三', '四', '五', '六'];
  return labels[d.getUTCDay()];
}

function round(n: number) {
  return Math.round(n * 10) / 10;
}

function roundMacros<T extends Record<string, number>>(o: T): T {
  const out = { ...o };
  for (const k of Object.keys(out)) {
    out[k as keyof T] = round(out[k as keyof T]) as T[keyof T];
  }
  return out;
}
