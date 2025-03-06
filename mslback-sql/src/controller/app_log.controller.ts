import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Admin_login_logDTO } from '../dto/admin_login_log.dto';
import { App_logService } from '../service/app_log.service';

@Controller('msl/app_log')
@ApiTags('app_log')
export class App_logController {
  constructor(private readonly app_logService: App_logService) { }

  @Post('/save')
  async postLog(@Body() body: Admin_login_logDTO): Promise<any> {
    return await this.app_logService.LogInsert(body);
  }
}
