import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { App_logEntity } from '../entity/app_log.entity';
import { Admin_login_logDTO } from '../dto/admin_login_log.dto';

@Injectable()
export class App_logService {
  constructor(
    @InjectRepository(App_logEntity)
    private app_logRepository: Repository<App_logEntity>,
  ) { }

  async LogInsert(body: Admin_login_logDTO): Promise<any> {
    let boolResult = false;
    try {
      const result = await this.app_logRepository
        .createQueryBuilder()
        .insert()
        .into(App_logEntity)
        .values([
          {
            eq: body.eq,
            phone: body.phone,
            writetime: body.writetime,
            gubun: body.gubun,
            activity: body.activity,
          },
        ])
        .execute();
      boolResult = result.identifiers.length > 0;
      console.log('app_log - insert');
      return `result = ${boolResult}`;
    } catch (E) {
      console.log(E);
      return E;
    }
  }
}
