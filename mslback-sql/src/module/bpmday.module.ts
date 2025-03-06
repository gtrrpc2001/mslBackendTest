import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BpmdayController } from '../controller/bpmday.controller';
import { BpmdayEntity } from '../entity/bpmday.entity';
import { Ecg_ArrEntity } from '../entity/ecg_arr.entity';
import { DataUpdateLastEntity } from '../entity/dataUpdateLast.entity';
import { BpmdayService } from '../service/bpmday.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BpmdayEntity,
      DataUpdateLastEntity,
      Ecg_ArrEntity,
    ]),
  ],
  controllers: [BpmdayController],
  providers: [BpmdayService],
})
export class BpmdayModule { }
