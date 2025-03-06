import {
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisConfig implements RedisModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) { }

  createRedisModuleOptions(): RedisModuleOptions {
    return {
      type: 'single',
      url: `redis://${this.configService.get<string>('REDISHOST')}:${this.configService.get<string>('REDISPORT')}`,
      options: {
        password: this.configService.get<string>('PASSWORD'),
        db: Number(this.configService.get<Number>('REDISDB')),
      }

    };
  }
}
