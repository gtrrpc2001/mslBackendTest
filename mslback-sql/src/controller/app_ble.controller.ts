import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Admin_login_logDTO } from '../dto/admin_login_log.dto';
import { App_bleService } from '../service/app_ble.service';

@Controller('msl/app_ble')
@ApiTags('app_ble')
export class App_bleController {
  constructor(private readonly app_bleService: App_bleService) { }

  @Post('/save')
  async postLog(@Body() body: Admin_login_logDTO): Promise<any> {
    return await this.app_bleService.LogInsert(body);
  }
}
