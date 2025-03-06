import { Controller, Get, Post, Put, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppVersionDTO } from '../dto/appversion.dto';
import { AppVersionService } from '../service/appversion.service';

@Controller('msl/appversion')
@ApiTags('appversion')
export class AppVersionController {
  constructor(private readonly appVersionService: AppVersionService) { }

  @Put('/update')
  async putVersion(@Body() body: AppVersionDTO): Promise<any> {
    return await this.appVersionService.updateVersion(body);
  }

  @Get('/getVersion')
  async getVersion(
    @Query('app') app: string,
    @Query('gubun') gubun: string,
  ): Promise<string> {
    return await this.appVersionService.getVersion(app, gubun);
  }
}
