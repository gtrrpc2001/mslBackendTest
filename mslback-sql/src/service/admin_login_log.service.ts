import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin_login_logEntity } from '../entity/admin_login_log.entity';
import { Admin_login_logDTO } from '../dto/admin_login_log.dto';

@Injectable()
export class Admin_login_logService {
  constructor(
    @InjectRepository(Admin_login_logEntity)
    private admin_login_logRepository: Repository<Admin_login_logEntity>,
  ) { }

  async LogInsert(body: Admin_login_logDTO): Promise<any> {
    let boolResult = false;
    try {
      const result = await this.admin_login_logRepository
        .createQueryBuilder()
        .insert()
        .into(Admin_login_logEntity)
        .values([
          {
            gubun: body.gubun,
            eq: body.eq,
            eqname: body.eqname,
            writetime: body.writetime,
            activity: body.activity,
          },
        ])
        .execute();
      boolResult = result.identifiers.length > 0;
      console.log('admin - insert');
      return `result = ${boolResult}`;
    } catch (E) {
      console.log(E);
      return E;
    }
  }
}
