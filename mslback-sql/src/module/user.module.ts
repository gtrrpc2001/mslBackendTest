import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserResolver } from '../resolver/user.resolver';
import {
  delete_user_last_logEntity,
  DataUpdateLastEntity,
} from '../entity/dataUpdateLast.entity';
import { parentsEntity } from '../entity/parents.entity';
import { DeleteUserLogEntity, UserEntity } from '../entity/user.entity';
import { UserService } from '../service/user.service';
import { APP_GUARD } from '@nestjs/core';
import { AbusingGuard } from 'guard/abusing.guard';
import { AuthModule } from './auth.module';
import { UserProcessor } from 'processor/user.processor';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      DataUpdateLastEntity,
      parentsEntity,
      DeleteUserLogEntity,
      delete_user_last_logEntity,
    ]),

    AuthModule,

    BullModule.registerQueue(
      {
        name: 'user-signin',
        sharedConnection: true,
        forceDisconnectOnShutdown: true,
        defaultJobOptions: {
          lifo: true,
          removeOnComplete: {
            count: 1,
            age: 60000
          },
          removeOnFail: { count: 3, age: 60000 },
        }
      },
    ),
  ],
  exports: [UserService],
  providers: [UserService, UserResolver, UserProcessor,
    {
      provide: APP_GUARD,
      useClass: AbusingGuard,
    },
  ],
})
export class UserModule { }
