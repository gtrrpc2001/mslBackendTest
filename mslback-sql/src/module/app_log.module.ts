import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App_logController } from '../controller/app_log.controller';
import { App_logEntity } from '../entity/app_log.entity';
import { App_logService } from '../service/app_log.service';

@Module({
  imports: [TypeOrmModule.forFeature([App_logEntity])],
  controllers: [App_logController],
  providers: [App_logService],
})
export class App_logModule { }
