import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/current-user.decorator';
import { CreateFoodLogDto } from './dto/create-food-log.dto';
import { FoodLogsService } from './food-logs.service';

@Controller('food-logs')
@UseGuards(JwtAuthGuard)
export class FoodLogsController {
  constructor(private readonly logs: FoodLogsService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateFoodLogDto) {
    return this.logs.create(user.id, dto);
  }

  @Get('daily-summary')
  dailySummary(@CurrentUser() user: User, @Query('date') date?: string) {
    return this.logs.dailySummary(user.id, date);
  }

  @Get('weekly-trend')
  weeklyTrend(@CurrentUser() user: User, @Query('days') days?: string) {
    return this.logs.weeklyTrend(user.id, days);
  }
}
