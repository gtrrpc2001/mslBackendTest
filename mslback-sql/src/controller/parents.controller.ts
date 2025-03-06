import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { parentsService } from '../service/parents.service';
import { parentsDTO } from '../dto/parents.dto';

@Controller('msl/parents')
@ApiTags('parents')
export class parentsController {
  constructor(
    private readonly parentsService: parentsService,
    //private configService:ConfigService
  ) { }

  @Post('/api_getdata')
  async postAll(@Body() body: parentsDTO): Promise<string> {
    return await this.parentsService.postParent(body);
  }

  @Get('/getTest')
  async getAll(@Query('eq') eq: string[]): Promise<boolean> {
    return true;
  }
}
