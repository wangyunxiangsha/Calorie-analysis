import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type LlmDishInsight = {
  name: string;
  estimatedServingG: number;
  confidence: number;
  caloriesEstimate?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  notes?: string;
};

type LlmVisionRaw = {
  dishes?: Array<{
    name?: string;
    estimatedServingG?: number;
    confidence?: number;
    caloriesEstimate?: number;
    proteinG?: number;
    carbsG?: number;
    fatG?: number;
    notes?: string;
  }>;
};

type LlmConfig = {
  apiKey: string;
  baseUrl: string;
  model: string;
  provider: 'deepseek' | 'zhipu' | 'openai_compatible';
  timeoutMs: number;
};

@Injectable()
export class LlmVisionService {
  private readonly logger = new Logger(LlmVisionService.name);

  constructor(private readonly config: ConfigService) {}

  isEnabled(): boolean {
    return Boolean(this.resolveApiKey());
  }

  async analyzeFoodImage(
    imageBase64: string,
    mimeType = 'image/jpeg',
  ): Promise<LlmDishInsight[]> {
    const cfg = this.resolveConfig();
    const base64Len = imageBase64.trim().length;
    const approxKb = Math.round((base64Len * 3) / 4 / 1024);
    this.logger.log(
      `LLM vision start model=${cfg.model} image≈${approxKb}KB timeout=${cfg.timeoutMs}ms`,
    );

    try {
      return await this.requestVision(cfg, imageBase64, mimeType);
    } catch (e) {
      if (this.isTimeoutError(e)) {
        this.logger.warn(
          `LLM vision timeout (${cfg.timeoutMs}ms), retrying once…`,
        );
        try {
          return await this.requestVision(cfg, imageBase64, mimeType);
        } catch (retryErr) {
          if (this.isTimeoutError(retryErr)) {
            throw new ServiceUnavailableException(
              '大模型识别超时（图片过大或网络较慢），请换更小照片或改用手动搜索',
            );
          }
          throw retryErr;
        }
      }
      throw e;
    }
  }

  private async requestVision(
    cfg: LlmConfig,
    imageBase64: string,
    mimeType: string,
  ): Promise<LlmDishInsight[]> {
    const dataUrl = this.toDataUrl(imageBase64, mimeType);
    const prompt = this.buildPrompt();
    const url = this.chatCompletionsUrl(cfg.baseUrl);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), cfg.timeoutMs);
    const started = Date.now();

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cfg.apiKey}`,
        },
        body: JSON.stringify(
          this.buildRequestBody(cfg, prompt, dataUrl),
        ),
        signal: controller.signal,
      });

      if (!res.ok) {
        const errText = await res.text();
        this.logger.error(
          `LLM vision HTTP ${res.status} (${Date.now() - started}ms): ${errText.slice(0, 500)}`,
        );
        if (this.isVisionUnsupportedError(errText)) {
          throw new ServiceUnavailableException(
            '当前模型不支持图片输入。请改用视觉模型（如智谱 glm-4.6v、通义 qwen-vl-plus），并检查 LLM_BASE_URL 与 LLM_VISION_MODEL 配置。',
          );
        }
        throw new ServiceUnavailableException('大模型识别服务暂时不可用');
      }

      const body = (await res.json()) as {
        choices?: Array<{
          message?: { content?: string; reasoning_content?: string };
        }>;
      };
      const message = body.choices?.[0]?.message;
      const content = message?.content?.trim() || message?.reasoning_content?.trim();
      if (!content) {
        throw new ServiceUnavailableException('大模型未返回识别结果');
      }

      const dishes = this.parseDishes(content);
      this.logger.log(
        `LLM vision ok ${Date.now() - started}ms dishes=${dishes.length}`,
      );
      return dishes;
    } catch (e) {
      if (
        e instanceof ServiceUnavailableException ||
        e instanceof BadRequestException
      ) {
        throw e;
      }
      if (this.isTimeoutError(e)) {
        this.logger.warn(`LLM vision aborted after ${Date.now() - started}ms`);
        throw e;
      }
      this.logger.error('LLM vision failed', e);
      throw new ServiceUnavailableException('大模型识别失败，请改用手动搜索');
    } finally {
      clearTimeout(timer);
    }
  }

  private isTimeoutError(e: unknown): boolean {
    return e instanceof Error && e.name === 'AbortError';
  }

  private resolveApiKey(): string | undefined {
    return (
      this.config.get<string>('ZHIPU_API_KEY')?.trim() ||
      this.config.get<string>('DEEPSEEK_API_KEY')?.trim() ||
      this.config.get<string>('LLM_API_KEY')?.trim()
    );
  }

  private resolveConfig(): LlmConfig {
    const apiKey = this.resolveApiKey();
    if (!apiKey) {
      throw new ServiceUnavailableException(
        '未配置 ZHIPU_API_KEY、DEEPSEEK_API_KEY 或 LLM_API_KEY，请在 apps/api/.env 中设置',
      );
    }

    const baseUrl =
      this.config.get<string>('LLM_BASE_URL')?.trim() ||
      'https://open.bigmodel.cn/api/paas/v4';
    const model =
      this.config.get<string>('LLM_VISION_MODEL')?.trim() || 'glm-4v-flash';
    const provider = this.resolveProvider(baseUrl);

    return {
      apiKey,
      baseUrl,
      model,
      provider,
      timeoutMs: Number(this.config.get('LLM_TIMEOUT_MS') ?? 180_000),
    };
  }

  getProviderLabel(): string {
    const cfg = this.resolveConfig();
    return cfg.model;
  }

  private resolveProvider(baseUrl: string): LlmConfig['provider'] {
    const explicit = this.config.get<string>('LLM_PROVIDER')?.trim();
    if (explicit === 'deepseek' || explicit === 'zhipu') return explicit;
    if (explicit === 'glm') return 'zhipu';
    if (baseUrl.includes('deepseek.com')) return 'deepseek';
    if (baseUrl.includes('bigmodel.cn')) return 'zhipu';
    return 'openai_compatible';
  }

  private chatCompletionsUrl(baseUrl: string): string {
    const base = baseUrl.replace(/\/$/, '');
    return `${base}/chat/completions`;
  }

  private buildPrompt(): string {
    return `识别图中主要食物（最多3种），估计单份可食克数与热量。只输出 JSON：
{"dishes":[{"name":"菜名","estimatedServingG":200,"confidence":0.85,"caloriesEstimate":350,"proteinG":12,"carbsG":40,"fatG":8}]}
规则：name 用简短中文标准菜名；estimatedServingG 50~800；confidence 0~1；无法识别则 {"dishes":[]}`;
  }

  private buildRequestBody(
    cfg: LlmConfig,
    prompt: string,
    dataUrl: string,
  ): Record<string, unknown> {
    const messages = [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: dataUrl } },
        ],
      },
    ];

    const body: Record<string, unknown> = {
      model: cfg.model,
      messages,
      stream: false,
      max_tokens: 512,
    };

    if (cfg.provider === 'deepseek') {
      body.thinking = { type: 'disabled' };
      body.response_format = { type: 'json_object' };
    } else if (cfg.provider === 'zhipu') {
      body.temperature = 0.2;
      body.response_format = { type: 'json_object' };
    } else {
      body.temperature = 0.2;
      body.response_format = { type: 'json_object' };
    }

    return body;
  }

  private isVisionUnsupportedError(errText: string): boolean {
    const lower = errText.toLowerCase();
    return (
      lower.includes('image') ||
      lower.includes('vision') ||
      lower.includes('multimodal') ||
      lower.includes('unsupported') ||
      lower.includes('not support')
    );
  }

  private toDataUrl(imageBase64: string, mimeType: string): string {
    const trimmed = imageBase64.trim();
    if (trimmed.startsWith('data:')) return trimmed;
    const mime = mimeType || 'image/jpeg';
    return `data:${mime};base64,${trimmed}`;
  }

  private parseDishes(content: string): LlmDishInsight[] {
    let parsed: LlmVisionRaw;
    try {
      const jsonText = content
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();
      parsed = JSON.parse(jsonText) as LlmVisionRaw;
    } catch {
      throw new BadRequestException('大模型返回格式无法解析');
    }

    const dishes = parsed.dishes ?? [];
    return dishes
      .filter((d) => d.name?.trim())
      .map((d) => ({
        name: d.name!.trim(),
        estimatedServingG: this.clampServing(d.estimatedServingG),
        confidence: this.clampConfidence(d.confidence),
        caloriesEstimate: d.caloriesEstimate,
        proteinG: d.proteinG,
        carbsG: d.carbsG,
        fatG: d.fatG,
        notes: d.notes?.trim() || undefined,
      }))
      .slice(0, 3);
  }

  private clampServing(g?: number): number {
    const n = Math.round(Number(g) || 200);
    return Math.min(800, Math.max(50, n));
  }

  private clampConfidence(c?: number): number {
    const n = Number(c);
    if (Number.isNaN(n)) return 0.75;
    return Math.min(0.99, Math.max(0.3, n));
  }
}
