import { Controller, Get, Post, Body, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Ecg_byteDTO } from '../dto/ecg_byte.dto';
import { Ecg_byteService } from '../service/ecg_byte.service';

@Controller('msl/ecgbyte')
@ApiTags('ecg')
export class Ecg_byteController {
  constructor(private readonly ecg_byteService: Ecg_byteService) { }

  @Post('/save')
  async save(@Body() body: Ecg_byteDTO): Promise<any> {
    return await this.ecg_byteService.InsertEcgPacket(body);
  }

  @Get('/Ecg')
  async getEcg(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
  ): Promise<number[]> {
    return await this.ecg_byteService.getEcg(eq, startDate);
  }

  @Get('/EcgTime')
  async getEcgTime(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<string[]> {
    return await this.ecg_byteService.getEcgTime(eq, startDate, endDate);
  }

  @Get('/GraphEcg')
  async getGraphEcg(
    @Query('eq') eq: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<any> {
    return await this.ecg_byteService.getGraphEcgValue(eq, startDate, endDate);
  }
}
