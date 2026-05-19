import { Injectable } from '@nestjs/common';
import { HealthMode, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

type DailyTargets = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  sodiumMg?: number;
  sugarG?: number;
};

@Injectable()
export class GoalsService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveGoal(userId: string) {
    return this.prisma.userGoal.findFirst({
      where: { userId, active: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async recalculateForUser(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    const modeConfig = await this.prisma.modeConfig.findUnique({
      where: { healthMode: user.healthMode },
    });
    const targets = this.computeTargets(user, modeConfig?.config as Record<string, number> | undefined);

    await this.prisma.userGoal.updateMany({
      where: { userId, active: true },
      data: { active: false },
    });

    return this.prisma.userGoal.create({
      data: {
        userId,
        healthMode: user.healthMode,
        targets: targets as object,
        active: true,
      },
    });
  }

  private computeTargets(
    user: User,
    modeCoeffs?: Record<string, number>,
  ): DailyTargets {
    const weight = Number(user.weightKg ?? 65);
    const height = Number(user.heightCm ?? 170);
    const age = user.age ?? 30;
    const isMale = user.gender === 1;

    const bmr = isMale
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    const activityMap: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
    };
    const factor = activityMap[user.activityLevel ?? 'light'] ?? 1.375;
    let calories = Math.round(bmr * factor);

    const deficit = modeCoeffs?.calorieDeficit ?? 400;
    const proteinPerKg = modeCoeffs?.proteinPerKg ?? 1.6;

    switch (user.healthMode) {
      case HealthMode.lose_fat:
        calories -= deficit;
        break;
      case HealthMode.gain_muscle:
        calories += 300;
        break;
      case HealthMode.metabolic:
        calories = Math.round(calories * 0.95);
        break;
      case HealthMode.wellness:
        break;
      case HealthMode.pregnancy:
        calories += 200;
        break;
    }

    const proteinG = Math.round(weight * proteinPerKg);
    const fatG = Math.round((calories * 0.25) / 9);
    const carbsG = Math.round((calories - proteinG * 4 - fatG * 9) / 4);

    const targets: DailyTargets = {
      calories: Math.max(1200, calories),
      proteinG,
      carbsG: Math.max(0, carbsG),
      fatG,
    };

    if (user.healthMode === HealthMode.metabolic) {
      targets.sodiumMg = modeCoeffs?.sodiumMgMax ?? 2000;
      targets.sugarG = modeCoeffs?.sugarGMax ?? 50;
    }

    return targets;
  }
}
