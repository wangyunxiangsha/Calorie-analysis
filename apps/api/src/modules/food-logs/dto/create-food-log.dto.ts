import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { LogSource, MealType } from '@prisma/client';

export class CreateFoodLogDto {
  @IsString()
  foodId!: string;

  @IsEnum(MealType)
  mealType!: MealType;

  @IsEnum(LogSource)
  source!: LogSource;

  @IsNumber()
  @Min(1)
  servingG!: number;

  @IsOptional()
  @IsString()
  logDate?: string;
}
