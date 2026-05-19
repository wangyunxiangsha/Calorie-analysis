import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { HealthMode, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { UpdateModeConfigDto } from './dto/update-mode-config.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(username: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { username } });
    if (!admin) throw new UnauthorizedException('账号或密码错误');

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) throw new UnauthorizedException('账号或密码错误');

    const accessToken = await this.jwt.signAsync({
      sub: admin.id,
      type: 'admin',
    });

    return { accessToken };
  }

  async getOverviewStats() {
    const [userCount, foodCount, logCount, todayLogs] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.food.count({ where: { enabled: true } }),
      this.prisma.foodLog.count(),
      this.prisma.foodLog.count({
        where: {
          logDate: new Date(new Date().toISOString().slice(0, 10)),
        },
      }),
    ]);

    return {
      userCount,
      foodCount,
      logCount,
      todayLogs,
    };
  }

  listFoods(q?: string) {
    return this.prisma.food.findMany({
      where: q
        ? { name: { contains: q, mode: 'insensitive' } }
        : undefined,
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
  }

  createFood(dto: CreateFoodDto) {
    return this.prisma.food.create({ data: dto as Prisma.FoodCreateInput });
  }

  updateFood(id: string, dto: UpdateFoodDto) {
    return this.prisma.food.update({
      where: { id },
      data: dto as Prisma.FoodUpdateInput,
    });
  }

  listModeConfigs() {
    return this.prisma.modeConfig.findMany();
  }

  updateModeConfig(healthMode: string, dto: UpdateModeConfigDto) {
    return this.prisma.modeConfig.update({
      where: { healthMode: healthMode as HealthMode },
      data: {
        label: dto.label,
        config: dto.config as Prisma.InputJsonValue,
      },
    });
  }

  listRecognitionFeedback() {
    return this.prisma.recognitionFeedback.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
