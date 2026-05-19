import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

type WechatSession = { openid: string; session_key: string };

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async loginWithWechat(code: string) {
    const session = await this.exchangeCode(code);
    let user = await this.prisma.user.findUnique({
      where: { openid: session.openid },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: { openid: session.openid },
      });
    }

    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      type: 'user',
    });

    return {
      accessToken,
      user: {
        id: user.id,
        healthMode: user.healthMode,
        nickname: user.nickname,
      },
      isNewUser: user.weightKg == null,
    };
  }

  private async exchangeCode(code: string): Promise<WechatSession> {
    const appId = this.config.get<string>('WECHAT_APP_ID');
    const secret = this.config.get<string>('WECHAT_APP_SECRET');

    if (!appId || !secret) {
      if (process.env.NODE_ENV === 'production') {
        throw new UnauthorizedException('微信登录未配置');
      }
      return { openid: `dev_${code}`, session_key: 'dev' };
    }

    const url = new URL('https://api.weixin.qq.com/sns/jscode2session');
    url.searchParams.set('appid', appId);
    url.searchParams.set('secret', secret);
    url.searchParams.set('js_code', code);
    url.searchParams.set('grant_type', 'authorization_code');

    const res = await fetch(url.toString());
    const data = (await res.json()) as {
      openid?: string;
      session_key?: string;
      errcode?: number;
      errmsg?: string;
    };

    if (!data.openid) {
      throw new UnauthorizedException(data.errmsg ?? '微信登录失败');
    }

    return { openid: data.openid, session_key: data.session_key ?? '' };
  }
}
