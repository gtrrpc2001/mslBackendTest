import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EcgDataDTO } from '../dto/ecgdata.dto';
import { BpmdayService } from '../service/bpmday.service';

@Controller('msl/bpm')
@ApiTags('bpm')
export class BpmdayController {
  constructor(private readonly bpmdayService: BpmdayService) { }

  @Post('/save')
  async postAll(@Body() body: EcgDataDTO): Promise<any> {
    return await this.bpmdayService.InsertBpmData(body);
  }

  @Get('/api_getdata')
  async getBpm(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('test') test?: boolean,
  ): Promise<string> {
    if (!test) {
      return await this.bpmdayService.BpmData(eq, startDate, endDate);
    } else {
      return await this.bpmdayService.TestBpmData(eq, startDate, endDate);
    }
  }

  @Get('/webBpm')
  async getWebBpm(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<string> {
    return await this.bpmdayService.getWebBpm(eq, startDate, endDate);
  }

  @Get('/webGraphBpmHrvArr')
  async getWebGraph(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return await this.bpmdayService.webGraphBpmHrvArr(
      eq,
      startDate,
      endDate,
    );
  }
}
