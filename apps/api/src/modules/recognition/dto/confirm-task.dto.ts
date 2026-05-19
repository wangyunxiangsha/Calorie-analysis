import { IsString } from 'class-validator';

export class ConfirmRecognitionTaskDto {
  @IsString()
  foodId!: string;
}
