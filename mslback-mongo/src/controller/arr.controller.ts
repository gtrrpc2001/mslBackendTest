import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ObjectId, UpdateWriteOpResult } from 'mongoose';
import { ArrService } from 'src/service/arr.service';
import { Arr } from 'src/schema/arr.Schema';
import { ArrDto } from 'src/dto/arr.dto';


@Controller('arr')
@ApiTags('arr')
export class ArrController {
  constructor(private readonly arrService: ArrService) {}

  @Post('/create')
  async create(@Body() body:ArrDto):Promise<Arr>{
    return this.arrService.create(body);
  }

  @Post('/findOneAndUpdate')
  async findOneAndUpdate(@Body() body:ArrDto):Promise<Arr>{
    return this.arrService.findOneAndUpdate(body);
  }

  @Post('/updateMany')
  async updateMany(@Body() body:ArrDto):Promise<UpdateWriteOpResult>{
    return this.arrService.updateMany(body);
  }

  @Post('/delete')
  async deleteMany(@Body() body:ArrDto):Promise<{deletedCount: number}>{
    return this.arrService.delete(body);
  }

  @Get('/find')
  async findAll(): Promise<Arr[]> {
    return this.arrService.findAll();
  }

  @Get('/findMany')
  async findMany(
    @Query('id') eq:string,
    @Query('startDate') startDate:string,
    @Query('endDate') endDate:string,
  ): Promise<Arr[]> {    
    return this.arrService.findMany(eq,startDate,endDate);
  } 

  @Get('/findOne')
  async findOne(
    @Query('id') eq:string    
  ): Promise<Arr> {
    return this.arrService.findOne(eq);
  }  
}
