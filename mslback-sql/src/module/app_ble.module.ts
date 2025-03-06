import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App_bleController } from '../controller/app_ble.controller';
import { App_bleEntity } from '../entity/app_ble.entity';
import { parentsEntity } from '../entity/parents.entity';
import { App_bleService } from '../service/app_ble.service';

@Module({
  imports: [TypeOrmModule.forFeature([App_bleEntity, parentsEntity])],
  controllers: [App_bleController],
  providers: [App_bleService],
})
export class App_bleModule { }
