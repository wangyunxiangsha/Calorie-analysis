import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../../common/current-user.decorator';
import { ConfirmRecognitionTaskDto } from './dto/confirm-task.dto';
import { CreateRecognitionFeedbackDto } from './dto/create-feedback.dto';
import { RecognizeDto } from './dto/recognize.dto';
import { RecognitionService } from './recognition.service';

@Controller('recognition')
@UseGuards(JwtAuthGuard)
export class RecognitionController {
  constructor(private readonly recognition: RecognitionService) {}

  /** M2: upload image; M0 accepts imageUrl for dev */
  @Post('analyze')
  analyze(@CurrentUser() user: User, @Body() dto: RecognizeDto) {
    return this.recognition.analyze(user.id, dto);
  }

  @Post('feedback')
  feedback(@Body() dto: CreateRecognitionFeedbackDto) {
    return this.recognition.submitFeedback(dto);
  }

  @Patch('tasks/:taskId/confirm')
  confirmTask(
    @CurrentUser() user: User,
    @Param('taskId') taskId: string,
    @Body() dto: ConfirmRecognitionTaskDto,
  ) {
    return this.recognition.confirmTask(user.id, taskId, dto.foodId);
  }
}
