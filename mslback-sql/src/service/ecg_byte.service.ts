import { ExecutionContext, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
  MoreThan,
  LessThan,
} from 'typeorm';
import { commonFun } from '../clsfunc/commonfunc';
import { Ecg_byteEntity } from '../entity/ecg_byte.entity';
import { Ecg_byteDTO } from '../dto/ecg_byte.dto';
import { DataUpdateLastEntity } from '../entity/dataUpdateLast.entity';
import { SendEcgService } from './sendEcg.service';

@Injectable()
export class Ecg_byteService {
  constructor(
    @InjectRepository(Ecg_byteEntity)
    private ecg_byteRepository: Repository<Ecg_byteEntity>,
    @InjectRepository(DataUpdateLastEntity)
    private ecg_raw_history_lastRepository: Repository<DataUpdateLastEntity>,
    private readonly sendEcgService: SendEcgService,
  ) { }

  table = 'ecg_csv_ecgdata';
  select = 'eq,writetime,bpm,ecgpacket';

  async InsertEcgPacket(body: Ecg_byteDTO): Promise<string> {
    let boolResult = false;
    try {
      const result = await this.setInsert(body);

      if (result) {
        boolResult = await this.updateLast(body);
      }

      if (boolResult) {
        await this.grpcSendData(body)
      }

      console.log('ecgByteinsert');
      return `result = ${boolResult}`;
    } catch (E) {
      console.log(E)
    }
  }

  async grpcSendData(body: Ecg_byteDTO) {
    try {
      const grpcResponse = await this.sendEcgService.sendEcgData(body);
      console.log('gRPC Response:', grpcResponse);
    } catch (error) {
      console.log(error);
    }
  }

  async updateLast(body: Ecg_byteDTO): Promise<boolean> {
    try {
      const result = await this.ecg_raw_history_lastRepository
        .createQueryBuilder()
        .update(DataUpdateLastEntity)
        .set({ writetime: body.writetime, bpm: body.bpm })
        .where({ eq: body.eq })
        .execute();
      console.log('updateLast');
      return result.affected > 0;
    } catch (E) {
      //console.log(E) 대기열 문제 가끔 발생
      return false;
    }
  }

  async setInsert(body: Ecg_byteDTO): Promise<boolean> {
    try {
      const buffer = commonFun.getEcgBuffer(body.ecgPacket);
      // ecgpacket:() => `HEX(AES_ENCRYPT('${body.ecgPacket}','${key}'))`
      const result = await this.ecg_byteRepository
        .createQueryBuilder()
        .insert()
        .into(Ecg_byteEntity)
        .values([
          {
            eq: body.eq,
            writetime: body.writetime,
            timezone: body.timezone,
            bpm: body.bpm,
            ecgpacket: buffer,
          },
        ])
        .execute();
      return result.identifiers.length > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }

  async getEcgChangeValue(result: any[]): Promise<number[]> {
    let ecgArr: number[] = [];
    for (const r of result) {
      const { ecgpacket } = r;
      const ecg = commonFun.getEcgNumber(ecgpacket);
      for (const d of ecg) {
        ecgArr.push(d);
      }
    }
    return ecgArr;
  }

  async getGraphEcgChangeValue(
    result: Ecg_byteEntity[],
  ): Promise<{ ecg: number[]; writetime: string }[]> {
    let ecgArr = result.map((d) => {
      const { ecgpacket } = d;
      const ecg = commonFun.getEcgNumber(ecgpacket);
      return { ecg: ecg, writetime: d.writetime };
    });
    return ecgArr;
  }

  async getEcg(empid: string, startDate: string): Promise<number[]> {
    try {
      const result = await this.ecg_byteRepository
        .createQueryBuilder('ecg_byte')
        .select('ecgpacket')
        .where({ eq: empid })
        .andWhere({ writetime: MoreThanOrEqual(startDate) })
        .getRawMany();
      const changeEcg: number[] = await this.getEcgChangeValue(result);
      const Value = result.length != 0 && empid != null ? changeEcg : [0];
      console.log(empid);
      return Value;
    } catch (E) {
      console.log(E);
    }
  }

  async getEcgTime(
    empid: string,
    startDate: string,
    endDate: string,
  ): Promise<string[]> {
    try {
      const result = await this.ecg_byteRepository
        .createQueryBuilder('ecg_byte')
        .select('Mid(writetime,12,4) writetime')
        .where({ eq: empid })
        .andWhere({ writetime: MoreThanOrEqual(startDate) })
        .andWhere({ writetime: LessThan(endDate) })
        .groupBy('Mid(writetime,12,4)')
        .getRawMany();
      console.log(empid);
      return result;
    } catch (E) {
      console.log(E);
    }
  }

  async getGraphEcgValue(
    empid: string,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    try {
      const result: Ecg_byteEntity[] = await this.ecg_byteRepository
        .createQueryBuilder('ecg_byte')
        .select('ecgpacket,Mid(writetime,15,19) as writetime')
        .where({ eq: empid })
        .andWhere({ writetime: MoreThanOrEqual(startDate) })
        .andWhere({ writetime: LessThanOrEqual(endDate) })
        .getRawMany();
      const changeEcg = await this.getGraphEcgChangeValue(result);
      return changeEcg;
    } catch (E) {
      console.log(E);
    }
  }
}
