import { Controller, Get } from '@nestjs/common';

@Controller()
export class ApiRootController {
  @Get()
  root() {
    return {
      service: 'calorie-api',
      version: 'v1',
      message: 'API is running. Use the paths below — there is no handler for bare GET /api/v1 alone.',
      endpoints: {
        health: '/api/v1/health',
        wechatLogin: 'POST /api/v1/auth/wechat',
        dailySummary: 'GET /api/v1/food-logs/daily-summary',
        admin: 'http://localhost:5173',
      },
    };
  }
}
