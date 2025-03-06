import { ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EcgDataDTO } from '../dto/ecgdata.dto';
import { Ecg_ArrEntity } from '../entity/ecg_arr.entity';
import { commonFun } from '../clsfunc/commonfunc';
import { Repository, MoreThan, LessThan, Between } from 'typeorm';
import { commonQuery } from '../clsfunc/commonQuery';
import { parentsEntity } from '../entity/parents.entity';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../entity/user.entity';
import { alarmController } from '../alarm/alarmController';
import { Ecg_byteEntity } from '../entity/ecg_byte.entity';
import { UserCommonQuerycheckIDDupe } from './user.commonQuery';
import { SendArrService } from './sendArr.service';

@Injectable()
export class Ecg_ArrService {
  constructor(
    @InjectRepository(Ecg_ArrEntity)
    private ecg_csv_ecgdata_arrRepository: Repository<Ecg_ArrEntity>,
    @InjectRepository(parentsEntity)
    private parentsRepository: Repository<parentsEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(Ecg_byteEntity)
    private ecg_byteRepository: Repository<Ecg_byteEntity>,
    private configService: ConfigService,
    private sendArrService: SendArrService,
  ) { }

  table = 'ecg_csv_ecgdata_arr';
  select = 'writetime,ecgpacket';
  testSel = 'idx,writetime,ecgpacket,address';

  async InsertEcgPacket(body: EcgDataDTO): Promise<string> {
    try {
      const arrInsert = await this.setInsert(body);
      const result = arrInsert > 0;
      if (arrInsert > 0) {

        await this.grpcSendData({ idx: arrInsert, ...body })

        const parentsArr = await alarmController.getSelToken(
          this.parentsRepository,
          body.eq,
        );
        await alarmController.callPushAlarm(
          parentsArr,
          body,
          this.configService,
        );
      }
      return `result =  ${result}`;
    } catch (E) {
      console.log(E);
      return E as string;
    }
  }

  async grpcSendData(body: EcgDataDTO) {
    try {
      const grpcResponse = await this.sendArrService.sendArrData(body);
      console.log('gRPC Response:', grpcResponse);
    } catch (error) {
      console.log(error);
    }
  }

  async setInsert(body: EcgDataDTO): Promise<number> {
    try {
      const result = await this.ecg_csv_ecgdata_arrRepository
        .createQueryBuilder()
        .insert()
        .into(Ecg_ArrEntity)
        .values([
          {
            eq: body.eq,
            writetime: body.writetime,
            bodystate: body.bodystate,
            ecgpacket: body.ecgPacket,
            address: body.address,
          },
        ])
        .execute();
      console.log('arrinsert');

      const len = result.identifiers.length
      if (len > 0) {
        return result.identifiers[0].idx;
      }

      return len;
    } catch (E) {
      console.log(E);
    }
  }

  async arrEcgData(
    empid: string,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    console.log('arrEcgData');
    try {
      const result = await commonQuery.whereIfResult(
        this.ecg_csv_ecgdata_arrRepository,
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
    } catch (E) {
      console.log(E);
    }
  }

  async onlyArrCount(
    empid: string,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    try {
      console.log(empid, startDate, endDate);
      const result = await this.ecg_csv_ecgdata_arrRepository
        .createQueryBuilder()
        .select('COUNT(*) as arrCnt')
        .where({ eq: empid })
        .andWhere({ writetime: MoreThan(startDate) })
        .andWhere({ writetime: LessThan(endDate) })
        .andWhere('address is null', { address: null })
        .getRawOne();
      console.log(result);
      let Value =
        result.length != 0 && empid != null
          ? commonFun.converterJson(result)
          : 'result = 0';
      return Value;
    } catch (E) {
      console.log(E);
      return 'result = 0';
    }
  }

  async countArr(
    empid: string,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    try {
      let Value = await this.onlyArrCount(empid, startDate, endDate);
      const info = await UserCommonQuerycheckIDDupe.getProfile(
        this.userRepository,
        parentsEntity,
        empid,
        true,
      );
      if (!Value.includes('result') && !info.includes('result')) {
        const arr = Value?.replace('{', '');
        const profile = info?.replace('}', ',');
        Value = profile + arr;
      }
      return Value;
    } catch (E) {
      console.log(E);
    }
  }

  async graphArrCount(
    empid: string,
    startDate: string,
    endDate: string,
    len: number,
  ): Promise<string> {
    try {
      const startLen = commonFun.getStartLen(len);
      console.log(`${startLen} -- ${len}`);
      const result = await this.ecg_csv_ecgdata_arrRepository
        .createQueryBuilder('ecg_csv_ecgdata_arr')
        .select(`MID(writetime,${startLen},2) writetime,COUNT(ecgpacket) count`)
        .where({ eq: empid })
        .andWhere({ writetime: MoreThan(startDate) })
        .andWhere({ writetime: LessThan(endDate) })
        .groupBy(`MID(writetime,${startLen},2)`)
        .having('COUNT(ecgpacket)')
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

  async arrWritetime(
    empid: string,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    try {
      let result;
      if (endDate != '') {
        result = await this.ecg_csv_ecgdata_arrRepository
          .createQueryBuilder('ecg_csv_ecgdata_arr')
          .select('writetime,address')
          .where({ eq: empid })
          .andWhere({ writetime: MoreThan(startDate) })
          .andWhere({ writetime: LessThan(endDate) })
          .getRawMany();
      } else {
        result = await this.ecg_csv_ecgdata_arrRepository
          .createQueryBuilder()
          .select('ecgpacket')
          .where({ eq: empid })
          .andWhere({ writetime: startDate })
          .getRawMany();
      }
      const Value =
        result.length != 0 && empid != null
          ? commonFun.converterJson(result)
          : 'result = 0';
      console.log(empid);
      return Value;
    } catch (E) {
      console.log(E);
    }
  }

  async testArr(
    idx: number,
    empid: string,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    try {
      let result;
      if (endDate != '') {
        result = await this.ecg_csv_ecgdata_arrRepository
          .createQueryBuilder('ecg_csv_ecgdata_arr')
          .select(this.testSel)
          .where({ idx: MoreThan(idx) })
          .andWhere({ eq: empid })
          .andWhere({ writetime: MoreThan(startDate) })
          .andWhere({ writetime: LessThan(endDate) })
          .getRawMany();
      } else {
        result = await this.ecg_csv_ecgdata_arrRepository
          .createQueryBuilder()
          .select(this.testSel)
          .where({ idx: MoreThan(idx) })
          .andWhere({ eq: empid })
          .andWhere({ writetime: LessThan(endDate) })
          .getRawMany();
      }
      const Value =
        result.length != 0 && empid != null
          ? commonFun.convertCsv(commonFun.converterJson(result))
          : 'result = 0';
      console.log(empid);
      return Value;
    } catch (E) {
      console.log(E);
    }
  }

  async arrPreEcgData(eq: string, date: string): Promise<string> {
    try {
      const subQuery = await this.subQueryArr(eq, date);
      const result = await this.ecg_csv_ecgdata_arrRepository
        .createQueryBuilder('a')
        .select('b.ecgpacket ecg , a.ecgpacket arr')
        .leftJoin(
          subQuery,
          'b',
          'a.eq = b.eq AND b.writetime BETWEEN DATE_SUB(a.writetime,INTERVAL 4 SECOND) AND DATE_SUB(a.writetime,INTERVAL 2 SECOND)',
        )
        .where({ eq: eq })
        .andWhere({ writetime: date })
        .getRawMany();
      const Value =
        result.length != 0 && eq != null
          ? commonFun.converterJson(result)
          : 'result = 0';
      return Value;
    } catch (E) {
      console.log(E);
    }
  }

  async subQueryArr(eq: string, writetime: string): Promise<string> {
    const subSelect = 'eq,writetime,ecgpacket';
    const onlyDate = writetime.split(' ')[0];
    try {
      const result = await this.ecg_byteRepository
        .createQueryBuilder()
        .subQuery()
        .select(subSelect)
        .from(Ecg_byteEntity, '')
        .where(`eq = '${eq}'`)
        .andWhere(`writetime <= '${writetime}'`)
        .andWhere(`writetime >= '${onlyDate}'`)
        .orderBy('writetime', 'DESC')
        .limit(6)
        .getQuery();
      return result;
    } catch (E) {
      console.log(E);
    }
  }
}
