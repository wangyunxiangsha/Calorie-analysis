import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateModeConfigDto {
  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsObject()
  config?: Record<string, number>;
}
