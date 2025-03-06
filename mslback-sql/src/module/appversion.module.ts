import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppVersionController } from '../controller/appversion.controller';
import { AppVersionEntity } from '../entity/appversion.entity';
import { AppVersionService } from '../service/appversion.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppVersionEntity])],
  controllers: [AppVersionController],
  providers: [AppVersionService],
})
export class AppVersionModule { }
