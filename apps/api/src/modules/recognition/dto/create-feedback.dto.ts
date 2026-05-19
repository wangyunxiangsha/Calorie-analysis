import { IsOptional, IsString } from 'class-validator';

export class CreateRecognitionFeedbackDto {
  @IsOptional()
  @IsString()
  taskId?: string;

  @IsString()
  reportedName!: string;

  @IsOptional()
  @IsString()
  suggestedFoodId?: string;

  @IsOptional()
  @IsString()
  note?: string;
}
