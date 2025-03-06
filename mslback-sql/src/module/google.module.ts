import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GoogleService } from '../service/google/google.service';
import { GoogleStrategy } from '../service/google/googleStrategy.service';
import { SessionSerializer } from '../service/google/sessionSerializer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'entity/user.entity';
import { GoogleController } from 'controller/googleAuth.controller';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'google',
      session: true,
    }),
    TypeOrmModule.forFeature([
      UserEntity,
    ]),    
  ],
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy, SessionSerializer],
})
export class GoogleModule {}
