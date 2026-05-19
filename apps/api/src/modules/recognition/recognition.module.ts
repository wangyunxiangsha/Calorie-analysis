import { Module } from '@nestjs/common';
import { FoodsModule } from '../foods/foods.module';
import { RecognitionController } from './recognition.controller';
import { RecognitionService } from './recognition.service';
import { LlmVisionService } from './llm-vision.service';

@Module({
  imports: [FoodsModule],
  controllers: [RecognitionController],
  providers: [RecognitionService, LlmVisionService],
})
export class RecognitionModule {}
