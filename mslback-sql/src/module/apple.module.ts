import { Module } from '@nestjs/common';
import {HttpModule} from '@nestjs/axios';
import { AppleService } from '@service/apple/apple.service';
import { AppleController } from 'controller/appleAuth.controller';

@Module({
  imports: [HttpModule],
  controllers: [AppleController],
  providers: [AppleService],
})
export class AppleModule {}