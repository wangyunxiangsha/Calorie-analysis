import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
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

  /** 提交识别任务（异步），客户端轮询 GET tasks/:taskId */
  @Post('analyze')
  startAnalyze(@CurrentUser() user: User, @Body() dto: RecognizeDto) {
    return this.recognition.startAnalyze(user.id, dto);
  }

  @Get('tasks/:taskId')
  getTask(@CurrentUser() user: User, @Param('taskId') taskId: string) {
    return this.recognition.getTask(user.id, taskId);
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
