import { Injectable } from '@nestjs/common';
import { HealthMode, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GoalsService } from '../modes/goals.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly goals: GoalsService,
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    const activeGoal = await this.goals.getActiveGoal(userId);
    return {
      id: user.id,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
      gender: user.gender,
      age: user.age,
      heightCm: user.heightCm ? Number(user.heightCm) : null,
      weightKg: user.weightKg ? Number(user.weightKg) : null,
      activityLevel: user.activityLevel,
      healthMode: user.healthMode,
      targetWeightKg: user.targetWeightKg ? Number(user.targetWeightKg) : null,
      dailyTargets: activeGoal?.targets ?? null,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const data: Prisma.UserUpdateInput = {
      nickname: dto.nickname,
      avatarUrl: dto.avatarUrl,
      gender: dto.gender,
      age: dto.age,
      activityLevel: dto.activityLevel,
      targetWeightKg: dto.targetWeightKg,
    };

    if (dto.heightCm !== undefined) data.heightCm = dto.heightCm;
    if (dto.weightKg !== undefined) data.weightKg = dto.weightKg;

    let modeChanged = false;
    if (dto.healthMode) {
      data.healthMode = dto.healthMode as HealthMode;
      modeChanged = true;
    }

    const user = await this.prisma.user.update({ where: { id: userId }, data });

    if (modeChanged || dto.recalculateGoals) {
      await this.goals.recalculateForUser(userId);
    }

    return this.getProfile(userId);
  }
}
