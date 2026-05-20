import { join } from 'path';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { ResponseInterceptor } from './common/response.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { FoodsModule } from './modules/foods/foods.module';
import { FoodLogsModule } from './modules/food-logs/food-logs.module';
import { ModesModule } from './modules/modes/modes.module';
import { RecognitionModule } from './modules/recognition/recognition.module';
import { AdminModule } from './modules/admin/admin.module';
import { HealthModule } from './modules/health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Production (Zeabur/Docker): use platform env only — no .env file in image.
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? undefined
          : join(__dirname, '..', '..', '.env'),
    }),
    PrismaModule,
    StorageModule,
    HealthModule,
    AuthModule,
    UsersModule,
    FoodsModule,
    FoodLogsModule,
    ModesModule,
    RecognitionModule,
    AdminModule,
  ],
})
export class AppModule {}
