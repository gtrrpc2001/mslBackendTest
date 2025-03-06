import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyDataController } from '../controller/dailydata.controller';
import { DailyDataEntity } from '../entity/dailydata.entity';
import { DailyDataService } from '../service/dailydata.service';

@Module({
  imports: [TypeOrmModule.forFeature([DailyDataEntity])],
  controllers: [DailyDataController],
  providers: [DailyDataService],
})
export class DailyDataModule { }
