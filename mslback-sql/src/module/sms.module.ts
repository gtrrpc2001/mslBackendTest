import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { SmsService } from '../service/sms.service';
import { UserEntity } from '../entity/user.entity';
import { smsController } from '../controller/sms.controller';
import { smsEntity } from '../entity/sms.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsCachConfigService } from '../factory/cache.service';
import { EmailService } from '@service/email.service';
import { EmailGateway } from '@service/socket/emailGateway.service';
import { SocketInterceptorModule } from './socket.interceptor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([smsEntity, UserEntity]),
    CacheModule.registerAsync({
      isGlobal: false,
      useClass: SmsCachConfigService,
    }),
    SocketInterceptorModule
  ],
  providers: [SmsService, EmailService, EmailGateway],
  controllers: [smsController],
})
export class smsModule { }
