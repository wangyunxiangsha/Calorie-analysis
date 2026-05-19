import { Controller, Get, Param, Query } from '@nestjs/common';
import { FoodsService } from './foods.service';

@Controller('foods')
export class FoodsController {
  constructor(private readonly foods: FoodsService) {}

  @Get()
  search(@Query('q') q?: string, @Query('limit') limit?: string) {
    return this.foods.search(q, Number(limit) || 20);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foods.findOne(id);
  }
}
