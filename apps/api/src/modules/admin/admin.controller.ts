import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { UpdateModeConfigDto } from './dto/update-mode-config.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Post('auth/login')
  login(@Body() dto: AdminLoginDto) {
    return this.admin.login(dto.username, dto.password);
  }

  @Get('stats/overview')
  @UseGuards(AdminGuard)
  overview() {
    return this.admin.getOverviewStats();
  }

  @Get('foods')
  @UseGuards(AdminGuard)
  listFoods(@Query('q') q?: string) {
    return this.admin.listFoods(q);
  }

  @Post('foods')
  @UseGuards(AdminGuard)
  createFood(@Body() dto: CreateFoodDto) {
    return this.admin.createFood(dto);
  }

  @Patch('foods/:id')
  @UseGuards(AdminGuard)
  updateFood(@Param('id') id: string, @Body() dto: UpdateFoodDto) {
    return this.admin.updateFood(id, dto);
  }

  @Get('modes')
  @UseGuards(AdminGuard)
  listModes() {
    return this.admin.listModeConfigs();
  }

  @Patch('modes/:healthMode')
  @UseGuards(AdminGuard)
  updateMode(
    @Param('healthMode') healthMode: string,
    @Body() dto: UpdateModeConfigDto,
  ) {
    return this.admin.updateModeConfig(healthMode, dto);
  }

  @Get('recognition-feedback')
  @UseGuards(AdminGuard)
  listFeedback() {
    return this.admin.listRecognitionFeedback();
  }
}
