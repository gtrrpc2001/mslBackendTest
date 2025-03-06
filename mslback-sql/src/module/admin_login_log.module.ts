import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin_login_logController } from '../controller/admin_login_log.controller';
import { Admin_login_logEntity } from '../entity/admin_login_log.entity';
import { Admin_login_logService } from '../service/admin_login_log.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin_login_logEntity])],
  controllers: [Admin_login_logController],
  providers: [Admin_login_logService],
})
export class Admin_login_logModule { }
