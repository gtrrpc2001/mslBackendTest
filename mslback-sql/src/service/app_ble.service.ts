import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin_login_logDTO } from '../dto/admin_login_log.dto';
import { App_bleEntity } from '../entity/app_ble.entity';
import { ConfigService } from '@nestjs/config';
import { alarmController } from '../alarm/alarmController';
import { parentsEntity } from '../entity/parents.entity';
import { LoggerService } from 'factory/logger.service';

@Injectable()
export class App_bleService {
  constructor(
    @InjectRepository(App_bleEntity)
    private app_bleRepository: Repository<App_bleEntity>,
    @InjectRepository(parentsEntity)
    private parentsRepository: Repository<parentsEntity>,
    private configService: ConfigService,
    private readonly loggerService: LoggerService
  ) { }

  async LogInsert(body: Admin_login_logDTO): Promise<any> {
    try {
      let boolResult = false;
      const result = await this.app_bleRepository
        .createQueryBuilder()
        .insert()
        .into(App_bleEntity)
        .values([
          {
            eq: body.eq,
            phone: body.phone,
            writetime: body.writetime,
            activity: body.activity,
            serial: body.serial,
          },
        ])
        .execute();
      boolResult = result.identifiers.length > 0;
      const parentsArr = await alarmController.getSelToken(
        this.parentsRepository,
        body.eq,
      );
      boolResult = await alarmController.callPushAlarm(
        parentsArr,
        body,
        this.configService,
        true,
      );

      this.loggerService.Info('app_log - insert');
      return `result = ${boolResult}`;
    } catch (E) {
      this.loggerService.Error(E);
      return E;
    }
  }
}
