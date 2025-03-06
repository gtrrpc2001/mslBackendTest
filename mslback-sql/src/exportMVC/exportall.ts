import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MySqlMslConfigService } from '../factory/mysqlconfig.service';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { PrometheusService } from 'factory/prometheus.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfig } from 'factory/mongoconfig.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ServeStaticFactory } from 'factory/serveStatic.factory';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisConfig } from 'factory/redis.factory';
import { GrathModule } from './graphql.module';
import { RestModule } from './restful.module';
import { CustomLoggerModule } from 'module/logger.module';
import { BullConfigService } from 'factory/bull.factory';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from 'module/auth.module';

export class allModule {
  static appImport = [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      useClass: MySqlMslConfigService,
      inject: [MySqlMslConfigService],
    }),

    MongooseModule.forRootAsync({ useClass: MongoConfig, inject: [MongoConfig] }),
    PrometheusModule.registerAsync({ global: true, useClass: PrometheusService }),
    ServeStaticModule.forRootAsync({ useClass: ServeStaticFactory }),

    CustomLoggerModule,

    BullModule.forRootAsync({
      useClass: BullConfigService,
    }),

    RedisModule.forRootAsync({
      useClass: RedisConfig,
      inject: [RedisConfig]
    }),

    RestModule,
    GrathModule,
    AuthModule,

    // RedisSessionModule
  ];
}
