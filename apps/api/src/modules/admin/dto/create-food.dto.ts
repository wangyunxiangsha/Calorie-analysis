import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFoodDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  aliases?: string[];

  @IsNumber()
  caloriesPer100g!: number;

  @IsNumber()
  proteinPer100g!: number;

  @IsNumber()
  carbsPer100g!: number;

  @IsNumber()
  fatPer100g!: number;

  @IsOptional()
  @IsNumber()
  fiberPer100g?: number;

  @IsOptional()
  @IsNumber()
  sodiumMgPer100g?: number;

  @IsOptional()
  @IsNumber()
  sugarPer100g?: number;

  @IsOptional()
  @IsNumber()
  defaultServingG?: number;

  @IsOptional()
  @IsString()
  servingUnit?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
