import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataUpdateLastService } from '../service/dataUpdateLast.service';
import { DataUpdateLastDTO } from '../dto/ecg_raw_history_last.dto';

@Controller('msl/Last')
@ApiTags('Last')
export class DataUpdateLastController {
  constructor(
    private readonly dataUpdateLastService: DataUpdateLastService,
  ) { }

  @Post('/update')
  async update(@Body() body: DataUpdateLastDTO): Promise<any> {
    return await this.dataUpdateLastService.setEcgSerialNumber_update(body);
  }

  @Get('/last')
  async getLast(@Query('eq') eq: string): Promise<string> {
    return await this.dataUpdateLastService.getEcg_raw_history_last(eq);
  }

  @Get('/lastBpmTime')
  async getLastTime(@Query('eq') eq: string): Promise<string> {
    return await this.dataUpdateLastService.get_lastBpmTime(eq);
  }

  @Get('/webTable')
  async getTableListValue(@Query('eq') eq: string): Promise<any> {
    return await this.dataUpdateLastService.gethistory_last(eq);
  }
}
