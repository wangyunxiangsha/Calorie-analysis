import {
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
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
    let user;
    try {
      user = await this.prisma.user.findUnique({
        where: { openid: session.openid },
      });
      if (!user) {
        user = await this.prisma.user.create({
          data: { openid: session.openid },
        });
      }
    } catch (e) {
      console.error('[auth/wechat] database error', e);
      throw new ServiceUnavailableException(
        '数据库不可用，请在 Zeabur Terminal 执行 npx prisma migrate deploy',
      );
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

  private wechatCredentials() {
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
    return { appId, secret };
  }

  private async exchangeCode(code: string): Promise<WechatSession> {
    const { appId, secret } = this.wechatCredentials();

    if (!appId || !secret) {
      if (process.env.NODE_ENV === 'production') {
        const missing = [
          !appId ? 'WECHAT_APP_ID' : null,
          !secret ? 'WECHAT_APP_SECRET' : null,
        ].filter(Boolean);
        throw new UnauthorizedException(
          `微信登录未配置（缺少: ${missing.join(', ')}）。请在 Zeabur API 服务环境变量中填写并重新部署。`,
        );
      }
      return { openid: `dev_${code}`, session_key: 'dev' };
    }

    const url = new URL('https://api.weixin.qq.com/sns/jscode2session');
    url.searchParams.set('appid', appId);
    url.searchParams.set('secret', secret);
    url.searchParams.set('js_code', code);
    url.searchParams.set('grant_type', 'authorization_code');

    let data: {
      openid?: string;
      session_key?: string;
      errcode?: number;
      errmsg?: string;
    };
    try {
      const res = await fetch(url.toString(), {
        signal: AbortSignal.timeout(12_000),
      });
      const text = await res.text();
      try {
        data = JSON.parse(text) as typeof data;
      } catch {
        console.error('[auth/wechat] weixin non-json response', text.slice(0, 200));
        throw new ServiceUnavailableException('微信接口返回异常，请稍后重试');
      }
    } catch (e) {
      if (e instanceof ServiceUnavailableException) throw e;
      console.error('[auth/wechat] weixin fetch failed', e);
      throw new ServiceUnavailableException(
        '无法连接微信服务器（api.weixin.qq.com），请稍后重试',
      );
    }

    if (!data.openid) {
      const detail = data.errmsg ?? `errcode=${data.errcode ?? 'unknown'}`;
      console.warn('[auth/wechat] weixin error', detail);
      throw new UnauthorizedException(detail);
    }

    return { openid: data.openid, session_key: data.session_key ?? '' };
  }
}
