import { IsIn, IsOptional, IsString, ValidateIf } from 'class-validator';

export class RecognizeDto {
  @ValidateIf((o: RecognizeDto) => !o.imageBase64?.trim())
  @IsString()
  imageUrl?: string;

  @ValidateIf((o: RecognizeDto) => !o.imageUrl?.trim())
  @IsString()
  imageBase64?: string;

  @IsOptional()
  @IsString()
  @IsIn(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
  mimeType?: string;
}
