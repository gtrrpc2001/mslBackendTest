import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { commonFun } from '../clsfunc/commonfunc';
import { AppVersionDTO } from '../dto/appversion.dto';
import { AppVersionEntity } from '../entity/appversion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AppVersionService {
  constructor(
    @InjectRepository(AppVersionEntity)
    private appversionRepository: Repository<AppVersionEntity>,
  ) { }

  async getVersion(app: string, gubun: string): Promise<string> {
    try {
      const select = gubun == 'ios' ? 'versioncode' : 'versioncode,apkkey';
      const result = await this.appversionRepository
        .createQueryBuilder()
        .select(select)
        .where({ app: app })
        .andWhere({ gubun: gubun })
        .getRawOne();
      return commonFun.converterJson(result);
    } catch (E) {
      console.log(E);
    }
  }

  async updateVersion(body: AppVersionDTO): Promise<boolean> {
    try {
      let set;
      if (body.gubun == 'ios') {
        set = { versioncode: body.versioncode };
      } else {
        set = { versioncode: body.versioncode, apkkey: body.apkkey };
      }
      const result = await this.appversionRepository
        .createQueryBuilder()
        .update(AppVersionEntity)
        .set(set)
        .where({ app: body.app })
        .andWhere({ gubun: body.gubun })
        .execute();
      return result.affected > 0;
    } catch (E) {
      console.log(E);
      return false;
    }
  }
}
