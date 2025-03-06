import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DailyDataService } from '../service/dailydata.service';
import { EcgDataDTO } from '../dto/ecgdata.dto';

@Controller('msl/ecgday')
@ApiTags('ecgday')
export class DailyDataController {
  constructor(
    private readonly dailyDataService: DailyDataService,
  ) { }

  @Post('/save')
  async postAll(@Body() body: EcgDataDTO): Promise<any> {
    return await this.dailyDataService.insertDataDay(body);
  }

  @Get('/day')
  async getMonthly(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<string> {
    return await this.dailyDataService.getDay(
      'calandDistanceData',
      eq,
      startDate,
      endDate,
    );
  }

  @Get('/webDay')
  async getWebDayData(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('len') len: number,
  ): Promise<string> {
    return await this.dailyDataService.getWebSumDayData(
      eq,
      startDate,
      endDate,
      len,
    );
  }
}
