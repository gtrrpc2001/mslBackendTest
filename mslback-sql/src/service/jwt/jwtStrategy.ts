import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Payload } from '../../interface/payload';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    private config: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: Payload, done: VerifiedCallback): Promise<any> {

  }

  async checkJwt(payload: Payload): Promise<{ message: string | boolean }> {
    try {
      const accessToken = await this.redis.get(`${payload.usingType} : ${payload.eq}`);

      if (accessToken === 'invalid') {
        return { message: 'accessToken is blacklisted.' };
      }

      if (!accessToken) {
        return { message: 'accessToken is none.' };
      }

      const refreshToken = await this.redis.get(`${payload.usingType} : ${payload.eq} - ${accessToken}`);

      if (!refreshToken) {
        return { message: 'Invalid refreshToken' };
      }

      const vaild = await this.authService.tokenValidate(accessToken, refreshToken);

      if (!vaild) {
        return { message: 'Token vaildation does not exist!' };
      }



      return { message: accessToken === payload.headerToken };
    } catch (err) {
      return { message: 'Token validation failed.' };
    }
  }
}
