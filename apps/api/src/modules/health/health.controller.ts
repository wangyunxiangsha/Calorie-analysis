import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  check() {
    const appId = (
      this.config.get<string>('WECHAT_APP_ID') ??
      process.env.WECHAT_APP_ID ??
      ''
    ).trim();
    const secret = (
      this.config.get<string>('WECHAT_APP_SECRET') ??
      process.env.WECHAT_APP_SECRET ??
      ''
    ).trim();
    return {
      status: 'ok',
      service: 'calorie-api',
      wechatLoginConfigured: Boolean(appId && secret),
    };
  }
}
