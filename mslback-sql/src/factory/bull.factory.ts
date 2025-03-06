import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BullRootModuleOptions, SharedBullConfigurationFactory } from '@nestjs/bullmq';

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
    constructor(
        private readonly config: ConfigService
    ) { }
    createSharedConfiguration(): BullRootModuleOptions {
        return {
            connection: {
                host: this.config.get<string>('REDISHOST'),
                port: Number(this.config.get<string>('REDISPORT')),
                password: this.config.get<string>('PASSWORD'),
                db: Number(this.config.get<Number>('REDISDB')),
            }
        };
    }
}