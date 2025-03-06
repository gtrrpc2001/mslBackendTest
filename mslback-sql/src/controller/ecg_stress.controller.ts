import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Ecg_stressService } from '../service/ecg_stress.service';

@Controller('msl/ecgstress')
@ApiTags('ecgstress')
export class Ecg_stressController {
  constructor(private readonly ecg_stressService: Ecg_stressService) { }

  @Get("/ecgStressData")
  async getArrEcgData(
    @Query('eq') eq: string,
    @Query('startDate') sDate: string,
    @Query('endDate') eDate: string): Promise<any> {
    return await this.ecg_stressService.getStressData(eq, sDate, eDate);
  }
}