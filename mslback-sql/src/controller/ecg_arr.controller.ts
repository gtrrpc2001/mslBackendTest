import { Controller, Get, Post, Body, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EcgDataDTO } from '../dto/ecgdata.dto';
import { Ecg_ArrService } from '../service/ecg_arr.service';

@Controller('msl/ecgarr')
@ApiTags('ecgarr')
export class Ecg_ArrController {
  constructor(
    private readonly ecg_ArrService: Ecg_ArrService,
  ) { }

  @Post('/save')
  async postAll(@Body() body: EcgDataDTO): Promise<any> {
    return await this.ecg_ArrService.InsertEcgPacket(body);
  }

  @Get('/arrEcgData')
  async getArrEcgData(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<string> {
    return await this.ecg_ArrService.arrEcgData(
      eq,
      startDate,
      endDate,
    );
  }

  @Get('/arrWritetime')
  async getArrWritetime(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return await this.ecg_ArrService.arrWritetime(
      eq,
      startDate,
      endDate,
    );
  }

  @Get('/test')
  async getTest(
    @Query('idx') idx: number,
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return await this.ecg_ArrService.testArr(
      idx,
      eq,
      startDate,
      endDate,
    );
  }

  @Get('/arrCnt')
  async getCount(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return await this.ecg_ArrService.countArr(
      eq,
      startDate,
      endDate,
    );
  }

  @Get('/arrCount')
  async getOnlyCount(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return this.ecg_ArrService.onlyArrCount(eq, startDate, endDate);
  }

  @Get('/graphArrCnt')
  async getGraphArrCount(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('len') len: number,
  ): Promise<any> {
    return await this.ecg_ArrService.graphArrCount(
      eq,
      startDate,
      endDate,
      len,
    );
  }

  @Get('/arrPreEcgData')
  async getArrPreEcgData(
    @Query('eq') eq: string,
    @Query('date') date: string,
  ): Promise<any> {
    return await this.ecg_ArrService.arrPreEcgData(eq, date);
  }
}
