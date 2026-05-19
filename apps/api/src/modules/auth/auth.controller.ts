import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { WechatLoginDto } from './dto/wechat-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('wechat')
  wechatLogin(@Body() dto: WechatLoginDto) {
    return this.auth.loginWithWechat(dto.code);
  }
}
