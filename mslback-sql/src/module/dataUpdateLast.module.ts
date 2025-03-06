import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataUpdateLastController } from '../controller/dataUpdateLast.controller';
import { DailyDataEntity } from '../entity/dailydata.entity';
import { DataUpdateLastEntity } from '../entity/dataUpdateLast.entity';
import { DataUpdateLastService } from '../service/dataUpdateLast.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DataUpdateLastEntity,
      DailyDataEntity,
    ]),
  ],
  controllers: [DataUpdateLastController],
  providers: [DataUpdateLastService],
})
export class DataUpdateLastModule { }
