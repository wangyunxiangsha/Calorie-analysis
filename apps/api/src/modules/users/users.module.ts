import { Module } from '@nestjs/common';
import { ModesModule } from '../modes/modes.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [ModesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
