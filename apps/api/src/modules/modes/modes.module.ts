import { Module } from '@nestjs/common';
import { ModesController } from './modes.controller';
import { ModesService } from './modes.service';
import { GoalsService } from './goals.service';

@Module({
  controllers: [ModesController],
  providers: [ModesService, GoalsService],
  exports: [GoalsService, ModesService],
})
export class ModesModule {}
