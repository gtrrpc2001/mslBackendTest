import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UserDTO } from '../../dto/user.dto';
import { Payload } from '../../interface/payload';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import moment from 'moment';
import { Injectable } from '@nestjs/common';
import { JwtStrategy } from './jwtStrategy';
import { LoggerService } from 'factory/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
    private jwtStrategy: JwtStrategy,
    private loggerService: LoggerService
  ) { }

  async createToken(body: UserDTO, role: string): Promise<{ accessToken: string; refreshToken: string; issuedAt: string }> {
    let accessTime = 0;
    let refreshTime = 0;
    let refresh_expiresIn = '';
    let access_expiresIn = '';
    let issuedAt = moment.tz("UTC").format("YYYY-MM-DD HH:mm:ss");
    let usingType = "mobile"
    if (role === 'm') {
      refresh_expiresIn = this.configService.get('JWT_MOBILE_REFRESH_EXPIRES_IN');
      access_expiresIn = this.configService.get('JWT_MOBILE_ACCESS_EXPIRES_IN');
      accessTime = Number(this.configService.get('JWT_MOBILE_ACCESS'));
      refreshTime = Number(this.configService.get('JWT_MOBILE_REFRESH'));
    } else {
      refresh_expiresIn = this.configService.get('JWT_WEB_REFRESH_EXPIRES_IN');
      access_expiresIn = this.configService.get('JWT_WEB_ACCESS_EXPIRES_IN');
      accessTime = Number(this.configService.get('JWT_WEB_ACCESS'));
      refreshTime = Number(this.configService.get('JWT_WEB_REFRESH'));
      usingType = "web"
    }

    const accessToken = await this.jwtService.signAsync({ eq: body.eq }, { expiresIn: access_expiresIn });
    const refreshToken = await this.jwtService.signAsync({ eq: body.eq }, { expiresIn: refresh_expiresIn });

    await this.redis.set(`${usingType}-${body.eq} : ${body.eq}`, accessToken, 'EX', accessTime);
    await this.redis.set(`${usingType}-${body.eq} : ${body.eq} - ${accessToken}`, refreshToken, 'EX', refreshTime);

    return { accessToken, refreshToken, issuedAt };
  }

  async checkHeader(payload: Payload) {
    const resultValid = await this.jwtStrategy.checkJwt(payload)
    return resultValid;
  }

  async tokenValidate(accessToken: string, refreshToken: string): Promise<boolean> {
    try {
      const accessTokenValid = await this.jwtService.verifyAsync(accessToken);
      const refreshTokenValid = await this.jwtService.verifyAsync(refreshToken);
      return accessTokenValid && refreshTokenValid;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        this.loggerService.Error('Token expired: ', error)
      }
      return false;
    }
  }
}
