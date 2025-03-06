import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Admin_login_logDTO } from '../dto/admin_login_log.dto';
import { Admin_login_logService } from '../service/admin_login_log.service';

@Controller('msl/admin_login_log')
@ApiTags('admin_login_log')
export class Admin_login_logController {
  constructor(
    private readonly admin_login_logService: Admin_login_logService,
  ) { }

  @Post('/save')
  async postLog(@Body() body: Admin_login_logDTO): Promise<any> {
    return await this.admin_login_logService.LogInsert(body);
  }
}
