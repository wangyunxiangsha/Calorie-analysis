import { Module } from '@nestjs/common';
import { FoodsModule } from '../foods/foods.module';
import { ModesModule } from '../modes/modes.module';
import { FoodLogsController } from './food-logs.controller';
import { FoodLogsService } from './food-logs.service';

@Module({
  imports: [FoodsModule, ModesModule],
  controllers: [FoodLogsController],
  providers: [FoodLogsService],
})
export class FoodLogsModule {}
