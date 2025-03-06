import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
  MoreThan,
  LessThan,
} from 'typeorm';
import { Ecg_stressEntity } from '../entity/ecg_stress.entity';

@Injectable()
export class Ecg_stressService {
  constructor(
    @InjectRepository(Ecg_stressEntity)
    private ecg_stressRepository: Repository<Ecg_stressEntity>,
  ) { }

  async getStressData(eq: string, sDate: string, eDate: string): Promise<any> {
    try {
      const result = await this.ecg_stressRepository
        .createQueryBuilder()
        .select('eDate,lf_ms2, hf_ms2')
        .where({ eq: eq })
        .andWhere({ sDate: MoreThanOrEqual(sDate) })
        .andWhere({ eDate: LessThan(eDate) })
        .getRawMany();

      const value = this.getPns_Sns(result);
      return value;
    } catch (E) {
      console.log(E);
    }
  }

  getPns_Sns(result: any[]): { writetime: string, pns_percent: number, sns_percent: number }[] {
    const valueList: { writetime: string, pns_percent: number, sns_percent: number }[] = []
    if (result.length > 0) {
      result.forEach((value) => {
        const { eDate, lf_ms2, hf_ms2 } = value
        const pns_percent = (hf_ms2 / (lf_ms2 + hf_ms2)) * 100
        const sns_percent = (lf_ms2 / (lf_ms2 + hf_ms2)) * 100
        valueList.push({ writetime: eDate, pns_percent: pns_percent, sns_percent: sns_percent })
      })
    }
    return valueList;
  }
}
