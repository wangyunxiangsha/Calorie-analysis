import { Module } from '@nestjs/common';
import { ApiRootController } from './api-root.controller';
import { HealthController } from './health.controller';

@Module({
  controllers: [ApiRootController, HealthController],
})
export class HealthModule {}
