import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RecognitionStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { FoodsService } from '../foods/foods.service';
import { StorageService } from '../storage/storage.service';
import { LlmVisionService } from './llm-vision.service';
import { CreateRecognitionFeedbackDto } from './dto/create-feedback.dto';
import { RecognizeDto } from './dto/recognize.dto';
import {
  RecognitionAnalyzeResult,
  RecognitionCandidate,
} from './recognition.types';

@Injectable()
export class RecognitionService {
  private readonly logger = new Logger(RecognitionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly foods: FoodsService,
    private readonly llmVision: LlmVisionService,
    private readonly storage: StorageService,
  ) {}

  /** 创建任务并后台识别，立即返回 taskId */
  startAnalyze(userId: string, dto: RecognizeDto) {
    return this.prisma.recognitionTask
      .create({
        data: {
          userId,
          imageUrl: '',
          candidates: [],
          status: RecognitionStatus.processing,
        },
      })
      .then((task) => {
        void this.runAnalyzeInBackground(task.id, userId, dto);
        return { taskId: task.id, status: 'processing' as const };
      });
  }

  async getTask(userId: string, taskId: string) {
    const task = await this.prisma.recognitionTask.findFirst({
      where: { id: taskId, userId },
    });
    if (!task) throw new NotFoundException('识别任务不存在');

    if (task.status === RecognitionStatus.processing) {
      return { taskId: task.id, status: 'processing' as const };
    }

    if (task.status === RecognitionStatus.failed) {
      return {
        taskId: task.id,
        status: 'failed' as const,
        errorMessage: task.errorMessage ?? '识别失败',
      };
    }

    const candidates = (task.candidates as RecognitionCandidate[]) ?? [];
    const top = candidates[0];
    return {
      taskId: task.id,
      status: 'completed' as const,
      candidates,
      needsManualPick: !top?.foodId || (top?.confidence ?? 0) < 0.6,
      provider: task.provider ?? 'unknown',
    };
  }

  private runAnalyzeInBackground(
    taskId: string,
    userId: string,
    dto: RecognizeDto,
  ) {
    return this.executeAnalyze(userId, dto)
      .then(async (result) => {
        const imageRef = await this.resolveImageRef(userId, dto);
        await this.prisma.recognitionTask.update({
          where: { id: taskId },
          data: {
            imageUrl: imageRef,
            candidates: result.candidates as object,
            provider: result.provider,
            status: RecognitionStatus.pending,
            errorMessage: null,
          },
        });
      })
      .catch(async (e) => {
        const message = this.toErrorMessage(e);
        this.logger.error(`Recognition task ${taskId} failed: ${message}`, e);
        await this.prisma.recognitionTask.update({
          where: { id: taskId },
          data: {
            status: RecognitionStatus.failed,
            errorMessage: message,
          },
        });
      });
  }

  private async executeAnalyze(
    userId: string,
    dto: RecognizeDto,
  ): Promise<RecognitionAnalyzeResult> {
    const candidates = this.llmVision.isEnabled()
      ? await this.analyzeWithLlm(dto)
      : await this.analyzeWithMock(dto.imageUrl ?? '');

    const top = candidates[0];
    return {
      taskId: '',
      candidates,
      needsManualPick: !top?.foodId || (top?.confidence ?? 0) < 0.6,
      provider: this.llmVision.isEnabled()
        ? this.llmVision.getProviderLabel()
        : 'mock',
    };
  }

  private toErrorMessage(e: unknown): string {
    if (e instanceof HttpException) {
      const body = e.getResponse();
      if (typeof body === 'string') return body;
      const message = (body as { message?: string | string[] }).message;
      if (Array.isArray(message)) return message.join(', ');
      if (message) return message;
    }
    if (e instanceof Error && e.message) return e.message;
    return '识别失败，请稍后重试或改用手动搜索';
  }

  private async resolveImageRef(
    userId: string,
    dto: RecognizeDto,
  ): Promise<string> {
    if (dto.imageBase64?.trim()) {
      const mime = dto.mimeType?.trim() || 'image/jpeg';
      const url = await this.storage.saveMealImage(dto.imageBase64, mime);
      return url ?? '';
    }
    return dto.imageUrl?.trim() ?? '';
  }

  private async analyzeWithLlm(dto: RecognizeDto): Promise<RecognitionCandidate[]> {
    const base64 = dto.imageBase64?.trim();
    if (!base64) {
      throw new BadRequestException(
        '大模型识别需要上传图片（imageBase64），请更新小程序后重试',
      );
    }

    const dishes = await this.llmVision.analyzeFoodImage(
      base64,
      dto.mimeType?.trim() || 'image/jpeg',
    );

    if (dishes.length === 0) {
      return [];
    }

    const candidates: RecognitionCandidate[] = [];
    const seenFoodIds = new Set<string>();
    const matchRows = await Promise.all(
      dishes.map((dish) => this.foods.matchFoodForRecognition(dish.name, 3)),
    );

    for (let i = 0; i < dishes.length; i++) {
      const dish = dishes[i];
      const matches = matchRows[i];
      const food = matches[0];

      if (food && !seenFoodIds.has(food.id)) {
        seenFoodIds.add(food.id);
        candidates.push({
          name: food.name,
          confidence: dish.confidence,
          foodId: food.id,
          defaultServingG: dish.estimatedServingG,
          servingUnit: food.servingUnit,
          llmEstimate: {
            calories: dish.caloriesEstimate,
            proteinG: dish.proteinG,
            carbsG: dish.carbsG,
            fatG: dish.fatG,
            notes: dish.notes,
          },
        });
        continue;
      }

      if (!food) {
        candidates.push({
          name: dish.name,
          confidence: dish.confidence * 0.85,
          foodId: null,
          defaultServingG: dish.estimatedServingG,
          servingUnit: '份',
          llmEstimate: {
            calories: dish.caloriesEstimate,
            proteinG: dish.proteinG,
            carbsG: dish.carbsG,
            fatG: dish.fatG,
            notes: dish.notes,
          },
        });
      }
    }

    return candidates.slice(0, 5);
  }

  async submitFeedback(dto: CreateRecognitionFeedbackDto) {
    return this.prisma.recognitionFeedback.create({
      data: {
        taskId: dto.taskId,
        reportedName: dto.reportedName.trim(),
        suggestedFoodId: dto.suggestedFoodId,
        note: dto.note,
      },
    });
  }

  async confirmTask(userId: string, taskId: string, foodId: string) {
    const task = await this.prisma.recognitionTask.findFirst({
      where: { id: taskId, userId },
    });
    if (!task) throw new NotFoundException('识别任务不存在');

    return this.prisma.recognitionTask.update({
      where: { id: taskId },
      data: {
        status: RecognitionStatus.confirmed,
        chosenFoodId: foodId,
      },
    });
  }

  private async analyzeWithMock(imageUrl: string): Promise<RecognitionCandidate[]> {
    const mockName = this.mockDishName(imageUrl);
    const matches = await this.foods.fuzzyMatch(mockName, 5);

    const candidates: RecognitionCandidate[] = matches.map((food, i) => ({
      name: food.name,
      confidence: Math.max(0.5, 0.95 - i * 0.1),
      foodId: food.id,
      defaultServingG: Number(food.defaultServingG),
      servingUnit: food.servingUnit,
    }));

    if (candidates.length === 0) {
      candidates.push({
        name: mockName,
        confidence: 0.4,
        foodId: null,
        defaultServingG: 250,
        servingUnit: '份',
      });
    }

    return candidates;
  }

  private mockDishName(imageUrl: string): string {
    try {
      const path = new URL(imageUrl).pathname;
      const segment = path.split('/').filter(Boolean).pop() ?? '';
      const decoded = decodeURIComponent(segment).replace(/\.[a-z]+$/i, '');
      if (decoded.length >= 2) return decoded;
    } catch {
      /* ignore */
    }
    return '宫保鸡丁';
  }
}
