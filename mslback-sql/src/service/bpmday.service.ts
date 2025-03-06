import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan, MoreThanOrEqual } from 'typeorm';
import { EcgDataDTO } from '../dto/ecgdata.dto';
import { BpmdayEntity } from '../entity/bpmday.entity';
import { commonFun } from '../clsfunc/commonfunc';
import { commonQuery } from '../clsfunc/commonQuery';
import { DataUpdateLastEntity } from '../entity/dataUpdateLast.entity';
import { Ecg_ArrEntity } from '../entity/ecg_arr.entity';

@Injectable()
export class BpmdayService {
  constructor(
    @InjectRepository(BpmdayEntity)
    private ecg_csv_bpmdayRepository: Repository<BpmdayEntity>,
    @InjectRepository(DataUpdateLastEntity)
    private ecg_raw_history_lastRepository: Repository<DataUpdateLastEntity>,
    @InjectRepository(Ecg_ArrEntity)
    private ecg_csv_ecgdata_arrRepository: Repository<Ecg_ArrEntity>,
  ) { }

  table = 'ecg_csv_bpmday';
  select = 'idx,eq,writetime,timezone,bpm,temp,hrv';

  async gubunKind(body: EcgDataDTO): Promise<any> {
    switch (body.kind) {
      case 'BpmDataInsert':
        return this.InsertBpmData(body);
      case null:
        return `result = ${false}`;
    }
  }

  async InsertBpmData(body: EcgDataDTO): Promise<string> {
    let boolResult = false;
    console.log(`InsertBpmData --- ${body.writetime}`);
    try {
      const result = await this.setInsert(body);
      console.log(body.ecgtimezone);
      if (result) {
        boolResult = await this.updateLast(body);
      }

      return `result = ${boolResult}`;
    } catch (E) {
      console.log(E);
      return E as string;
    }
  }

  async updateLast(body: EcgDataDTO): Promise<boolean> {
    try {
      console.log(`${body.timezone}`);
      const timezone = body.timezone.includes('+')
        ? body.timezone
        : body.timezone.includes('-')
          ? body.timezone
          : ('+' + body.timezone).trim();
      const result = await this.ecg_raw_history_lastRepository
        .createQueryBuilder()
        .update(DataUpdateLastEntity)
        .set({
          writetime: body.writetime,
          hrv: body.hrv,
          cal: body.cal,
          calexe: body.calexe,
          step: body.step,
          distanceKM: body.distanceKM,
          arrcnt: body.arrcnt,
          temp: body.temp,
          timezone: timezone,
          battery: body.battery,
          isack: body.isack,
          log: body.log,
        })
        .where({ eq: body.eq })
        .execute();
      console.log('updateLast');
      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async setInsert(body: EcgDataDTO): Promise<boolean> {
    try {
      const result = await this.ecg_csv_bpmdayRepository
        .createQueryBuilder()
        .insert()
        .into(BpmdayEntity)
        .values([
          {
            eq: body.eq,
            timezone: body.timezone,
            writetime: body.writetime,
            bpm: body.bpm,
            temp: body.temp,
            hrv: body.hrv,
            spo2: body.spo2,
            breathe: body.breathe
          },
        ])
        .execute();
      return result.identifiers.length > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async TestBpmData(
    empid: string,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    const result = await commonQuery.whereIfResult(
      this.ecg_csv_bpmdayRepository,
      this.table,
      `${this.select},spo2,breathe`,
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

  async BpmData(
    empid: string,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    console.log('BpmData');
    const result = await commonQuery.whereIfResult(
      this.ecg_csv_bpmdayRepository,
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

  async getWebBpm(
    empid: string,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    try {
      const select = 'bpm,hrv,writetime';
      const result = await this.ecg_csv_bpmdayRepository
        .createQueryBuilder(this.table)
        .select(select)
        .where({ eq: empid })
        .andWhere({ writetime: MoreThan(startDate) })
        .andWhere({ writetime: LessThan(endDate) })
        .orderBy('MID(writetime,12,8)', 'ASC')
        .getRawMany();
      return commonFun.converterJson(result);
    } catch (E) {
      console.log(E);
    }
  }

  async webGraphBpmHrvArr(
    empid: string,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    try {
      const subQuery = await this.subQueryArr(empid, startDate, endDate);
      const result = await this.ecg_csv_bpmdayRepository
        .createQueryBuilder('a')
        .select('a.writetime,a.bpm,a.hrv,b.count')
        .leftJoin(
          subQuery,
          'b',
          'MID(a.writetime,1,18) = MID(b.writetime,1,18)',
        )
        .where({ eq: empid })
        .andWhere({ writetime: MoreThanOrEqual(startDate) })
        .andWhere({ writetime: LessThan(endDate) })
        .orderBy('writetime', 'ASC')
        .getRawMany();
      return commonFun.converterJson(result);
    } catch (E) {
      console.log(E);
    }
  }

  async subQueryArr(
    eq: string,
    writetime: string,
    endDate: string,
  ): Promise<string> {
    const subSelect = 'COUNT(ecgpacket) count,writetime';
    try {
      const result = await this.ecg_csv_ecgdata_arrRepository
        .createQueryBuilder()
        .subQuery()
        .select(subSelect)
        .from(Ecg_ArrEntity, '')
        .where(`eq = '${eq}'`)
        .andWhere(`writetime >= '${writetime}'`)
        .andWhere(`writetime < '${endDate}'`)
        .groupBy('writetime')
        .having('COUNT(ecgpacket)')
        .getQuery();
      return result;
    } catch (E) {
      console.log(E);
    }
  }
}
