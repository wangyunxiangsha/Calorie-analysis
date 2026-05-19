import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RecognitionStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { FoodsService } from '../foods/foods.service';
import { StorageService } from '../storage/storage.service';
import { LlmVisionService } from './llm-vision.service';
import { CreateRecognitionFeedbackDto } from './dto/create-feedback.dto';
import { RecognizeDto } from './dto/recognize.dto';

type Candidate = {
  name: string;
  confidence: number;
  foodId: string | null;
  defaultServingG: number;
  servingUnit: string;
  llmEstimate?: {
    calories?: number;
    proteinG?: number;
    carbsG?: number;
    fatG?: number;
    notes?: string;
  };
};

@Injectable()
export class RecognitionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly foods: FoodsService,
    private readonly llmVision: LlmVisionService,
    private readonly storage: StorageService,
  ) {}

  async analyze(userId: string, dto: RecognizeDto) {
    const imageRef = await this.resolveImageRef(userId, dto);
    const candidates = this.llmVision.isEnabled()
      ? await this.analyzeWithLlm(dto)
      : await this.analyzeWithMock(dto.imageUrl ?? '');

    const task = await this.prisma.recognitionTask.create({
      data: {
        userId,
        imageUrl: imageRef,
        candidates: candidates as object,
      },
    });

    const top = candidates[0];
    return {
      taskId: task.id,
      candidates,
      needsManualPick: !top?.foodId || (top?.confidence ?? 0) < 0.6,
      provider: this.llmVision.isEnabled()
        ? this.llmVision.getProviderLabel()
        : 'mock',
    };
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

  private async analyzeWithLlm(dto: RecognizeDto): Promise<Candidate[]> {
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

    const candidates: Candidate[] = [];
    const seenFoodIds = new Set<string>();

    for (const dish of dishes) {
      const matches = await this.foods.matchFoodForRecognition(dish.name, 3);
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

  /** 未配置 LLM 时降级：从 URL 路径猜菜名并匹配食物库 */
  private async analyzeWithMock(imageUrl: string): Promise<Candidate[]> {
    const mockName = this.mockDishName(imageUrl);
    const matches = await this.foods.fuzzyMatch(mockName, 5);

    const candidates: Candidate[] = matches.map((food, i) => ({
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
