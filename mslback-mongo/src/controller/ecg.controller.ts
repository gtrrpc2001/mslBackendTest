import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { EcgService } from 'src/service/ecg.service';
import { ApiTags } from '@nestjs/swagger';
import { Ecg } from 'src/schema/ecg.Schema';
import { EcgDto } from 'src/dto/ecg.dto';
import { ObjectId, UpdateWriteOpResult } from 'mongoose';


@Controller('ecg')
@ApiTags('ecg')
export class EcgController {
  constructor(private readonly ecgService: EcgService) {}

  @Post('/create')
  async create(@Body() ecg:EcgDto):Promise<Ecg>{
    return this.ecgService.create(ecg);
  }

  @Post('/findOneAndUpdate')
  async findOneAndUpdate(@Body() ecg:EcgDto):Promise<Ecg>{
    return this.ecgService.findOneAndUpdate(ecg);
  }

  @Post('/updateMany')
  async updateMany(@Body() ecg:EcgDto):Promise<UpdateWriteOpResult>{
    return this.ecgService.updateMany(ecg);
  }

  @Post('/delete')
  async deleteMany(@Body() ecg:EcgDto):Promise<{deletedCount: number}>{
    return this.ecgService.delete(ecg);
  }

  @Get('/find')
  async findAll(): Promise<Ecg[]> {
    return this.ecgService.findAll();
  }

  @Get('/findMany')
  async findMany(
    @Query('id') eq:string,
    @Query('startDate') startDate:string,
    @Query('endDate') endDate:string,
  ): Promise<Ecg[]> {    
    return this.ecgService.findMany(eq,startDate,endDate);
  } 

  @Get('/findOne')
  async findOne(
    @Query('id') eq:string    
  ): Promise<Ecg> {
    return this.ecgService.findOne(eq);
  }  

  @Get('/search')
  getHello(@Query('text') text:string) {
    return // this.ecgService.search(text);
  }
}
