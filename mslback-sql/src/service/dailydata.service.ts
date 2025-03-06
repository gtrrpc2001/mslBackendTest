import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { EcgDataDTO } from '../dto/ecgdata.dto';
import { DailyDataEntity } from '../entity/dailydata.entity';
import { commonFun } from '../clsfunc/commonfunc';
import { commonQuery } from '../clsfunc/commonQuery';
import { changeType } from '../clsfunc/changeType';

@Injectable()
export class DailyDataService {
  constructor(
    @InjectRepository(DailyDataEntity)
    private dailyDataRepository: Repository<DailyDataEntity>,
  ) { }

  table = 'ecg_csv_dataday';
  select = '';

  async insertDataDay(body: EcgDataDTO): Promise<string> {
    let boolResult = false;
    try {
      const month = changeType.getTimeChange(body.datamonth);
      const day = changeType.getTimeChange(body.dataday);
      const hour = changeType.getTimeChange(body.datahour);
      const writetime = `${body.datayear}-${month}-${day} ${hour}:00:00`;
      console.log(writetime + `----${body.eq}`);
      const dataDayRaw: DailyDataEntity[] = await this.getSelect(
        body,
        writetime,
      );
      if (dataDayRaw.length != 0) {
        boolResult = await this.setUpdate(body, writetime);
        console.log(body.eq + ' -- ' + 'update dataday');
      } else {
        boolResult = await this.setInsert(body, writetime);
        console.log('insertDataDay');
      }
      return `result = ${boolResult}`;
    } catch (E) {
      console.log(E);
      return E as string;
    }
  }

  async getSelect(body: EcgDataDTO, writetime: string): Promise<any> {
    const result = await this.dailyDataRepository
      .createQueryBuilder(this.table)
      .select('eq')
      .where({ eq: body.eq })
      .andWhere({ writetime: writetime })
      .getRawMany();
    return result;
  }

  async setUpdate(body: EcgDataDTO, writetime: string) {
    try {
      const result = await this.dailyDataRepository
        .createQueryBuilder()
        .update(DailyDataEntity)
        .set({
          step: body.step,
          distanceKM: body.distanceKM,
          cal: body.cal,
          calexe: body.calexe,
          arrcnt: body.arrcnt,
        })
        .where({ eq: body.eq })
        .andWhere({ writetime: writetime })
        .execute();
      return result.affected > 0;
    } catch (E) {
      console.log(E);
    }
  }

  async setInsert(body: EcgDataDTO, writetime: string): Promise<any> {
    try {
      const result = await this.dailyDataRepository
        .createQueryBuilder()
        .insert()
        .into(DailyDataEntity)
        .values([
          {
            eq: body.eq,
            writetime: writetime,
            datayear: body.datayear,
            datamonth: body.datamonth,
            dataday: body.dataday,
            datahour: body.datahour,
            timezone: body.ecgtimezone,
            step: body.step,
            distanceKM: body.distanceKM,
            cal: body.cal,
            calexe: body.calexe,
            arrcnt: body.arrcnt,
          },
        ])
        .execute();
      return result.identifiers.length > 0;
    } catch (E) {
      console.log(E);
    }
  }

  async getDay(
    kind: string,
    empid: string,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    switch (kind) {
      case 'calandDistanceData':
        this.select =
          'eq,writetime,timezone,datayear,datamonth,dataday,datahour,step,distanceKM,cal,calexe,arrcnt';
        return this.monthlyCalAndDistanceData(empid, startDate, endDate);
      case null:
        return `result = ${false}`;
    }
  }

  async monthlyCalAndDistanceData(
    empid: string,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    const result = await commonQuery.whereIfResult(
      this.dailyDataRepository,
      this.table,
      this.select,
      empid,
      startDate,
      endDate,
    );
    const Value =
      result.length != 0 && empid != null
        ? commonFun.convertCsv(commonFun.converterJson(result))
        : 'result = 0';
    return Value;
  }

  async getWebSumDayData(
    empid: string,
    startDate: string,
    endDate: string,
    len: number,
  ): Promise<string> {
    try {
      const startLen = commonFun.getStartLen(len);
      this.select = `MID(writetime,${startLen},2) writetime, SUM(cal) cal,SUM(calexe) calexe,SUM(step) step,SUM(distanceKM) distanceKM`;
      const result = await this.dailyDataRepository
        .createQueryBuilder(this.table)
        .select(this.select)
        .where({ eq: empid })
        .andWhere({ writetime: MoreThan(startDate) })
        .andWhere({ writetime: LessThan(endDate) })
        .groupBy(`MID(writetime,${startLen},2)`)
        .orderBy('writetime', 'ASC')
        .getRawMany();
      const Value =
        result.length != 0 && empid != null
          ? commonFun.converterJson(result)
          : 'result = 0';
      return Value;
    } catch (E) {
      console.log(E);
    }
  }
}
